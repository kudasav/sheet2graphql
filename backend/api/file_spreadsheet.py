import math
from select import select
from django.forms import CharField
from detect_delimiter import detect
from playhouse.shortcuts import model_to_dict
from peewee import *
import pandas as pd
from api.models import *
import psycopg2, re
from api.utilities import APIException
from datetime import datetime
import mimetypes
from django.conf import settings
from functools import reduce

database = PostgresqlDatabase(
    'worksheets',
    user = settings.DATABASES['default']['USER'],
    password = settings.DATABASES['default']['PASSWORD'],
    host = settings.DATABASES['default']['HOST'],
    port = settings.DATABASES['default']['PORT']
)

def camel_case(s):
    s = re.sub(r"(_|-)+", " ", s).title().replace(" ", "")
    return ''.join([s[0].lower(), s[1:]])

class Sheet:
    def __init__(self, headers, worksheet_id, title, project):
        self.title = camel_case(title)
        self.worksheet_id = worksheet_id
        self.headers = headers
        self.project = project
        self.table_class()

    def table_class(self):
        values = {}

        for column in self.headers:
            values[column] = CharField()

        values['Meta'] = type('Meta', (), {'database': database})
        
        self.table = type(self.worksheet_id, (Model,), values)
        
        return self.table

    def create_table(self):
        return database.create_tables([self.table])

    def check_authorization(self, info):
        if self.project.authentication:
            if "Authorization" not in info.context.headers:
                raise APIException('Authorization credentials not provided.')
            else:
                bearer = info.context.headers["Authorization"]
                bearer = bearer.replace('Bearer', '').strip()

                if bearer != self.project.bearer:
                    raise APIException('Authorization credentials invalid.')

        return True

    def incriment_usage(self):
        user = self.project.user
        current_month = datetime.strptime(datetime.now().strftime("%Y-%m-01"), "%Y-%m-%d").date()
        current = Usage.objects.filter(month=current_month, user=user).exists()

        if not current:
            usage = Usage(
                user = user,
                month = current_month,
                quota = 100000,
                total_requests = 1
            )

            usage.save()
        else:
            usage = Usage.objects.get(month=current_month, user=user)
            usage.total_requests = usage.total_requests + 1
            usage.save()

    def get_filtered_values(self, kwargs):
        conn = psycopg2.connect(
            database = "worksheets", 
            user = settings.DATABASES['default']['USER'],
            password = settings.DATABASES['default']['PASSWORD'],
            host = settings.DATABASES['default']['HOST'],
            port = settings.DATABASES['default']['PORT']
        )
        cur = conn.cursor()

        page = 1
        limit = 10

        if 'limit' in kwargs:
            limit = kwargs['limit']

        if 'page' in kwargs:
            page = kwargs['page']

        offset = (page - 1) * limit

        lt = {}
        lte = {}
        gt = {}
        gte = {}
        eq = {}
        neq = {}

        for v in kwargs['query']:
            for operation in kwargs['query'][v]:
                if operation == 'lt':
                    lt[v] = kwargs['query'][v][operation]

                if operation == 'lte':
                    lte[v] = kwargs['query'][v][operation]

                if operation == 'gt':
                    gt[v] = kwargs['query'][v][operation]

                if operation == 'gte':
                    gte[v] = kwargs['query'][v][operation]

                if operation == 'eq':
                    eq[v] = kwargs['query'][v][operation]

                if operation == 'neq':
                    neq[v] = kwargs['query'][v][operation]

        queries = []
        arguments = []

        if len(lt) > 0:
            queries += ["cast_float({col}) < %s".format(col=col, value=value) for col, value in lt.items()]
            arguments += [value for col, value in lt.items()]

        if len(lte) > 0:
            queries += ["cast_float({col}) <= %s".format(col=col, value=value) for col, value in lte.items()]
            arguments += [value for col, value in lte.items()]

        if len(gt) > 0:
            queries += ["cast_float({col}) > %s".format(col=col, value=value) for col, value in gt.items()]
            arguments += [value for col, value in gt.items()]

        if len(gte) > 0:
            queries += ["cast_float({col}) >= %s".format(col=col, value=value) for col, value in gte.items()]
            arguments += [value for col, value in gte.items()]

        if len(eq) > 0:
            queries += ["{col} = %s".format(col=col, value=value) for col, value in eq.items()]
            arguments += [value for col, value in eq.items()]

        if len(neq) > 0:
            queries += ["{col} != %s".format(col=col, value=value) for col, value in neq.items()]
            arguments += [value for col, value in neq.items()]

        queries = " AND ".join(queries)

        cast_function = """
            CREATE OR REPLACE FUNCTION cast_float(v_input text)
            RETURNS FLOAT AS $$
            DECLARE v_int_value FLOAT DEFAULT NULL;
            BEGIN
                BEGIN
                    v_int_value := v_input::FLOAT;
                EXCEPTION WHEN OTHERS THEN
                    RETURN NULL;
                END;
            RETURN v_int_value;
            END;
            $$ LANGUAGE plpgsql;

            {sql_query}
        """

        select_query = """
            Select * FROM public."{table}" WHERE {query} LIMIT {limit} OFFSET {offset}
        """.format(
            table = self.worksheet_id, 
            query = queries, 
            limit = limit, 
            offset = offset
        ) 

        select_query = cast_function.format(sql_query=select_query)

        count_query = """
            Select COUNT(*) FROM public."{table}" WHERE {query}
        """.format(
            table = self.worksheet_id, 
            query = queries
        )
        count_query = cast_function.format(sql_query=count_query)

    
        cur.execute(select_query, tuple(arguments))
        result = cur.fetchall()

        cur.execute(count_query, tuple(arguments))
        count = cur.fetchone()
        result_count = count[0]

        query_result = []
        headers = ['id', 'category', 'bookTitle', 'price', 'rating']
        for value in result:
            query_result.append(dict(zip(headers, value)))

        conn.close()

        num_pages = math.ceil(result_count / limit)
        pagination = {
            "count": result_count,
            "page": page,
            "pages": num_pages,
            "hasNext": page + 1 <= num_pages,
            "hasPrev": page - 1 > 0,
        }
        
        return {
            "pagination": pagination,
            "result": query_result
        }

    def get_values(self, info, *args, **kwargs):
        if 'query' in kwargs:
            return self.get_filtered_values(kwargs)

        page = 1
        limit = 10

        if 'limit' in kwargs:
            limit = kwargs['limit']

        if 'page' in kwargs:
            page = kwargs['page']

        result = self.table.select().order_by(self.table.id).paginate(page, limit)
        result_count = self.table.select().count()
        
        # calculate pagination
        num_pages = math.ceil(result_count / limit)
        pagination = {
            "count": result_count,
            "page": page,
            "pages": num_pages,
            "hasNext": page + 1 <= num_pages,
            "hasPrev": page - 1 > 0,
        }
        
        return {
            "pagination": pagination,
            "result": [model_to_dict(v) for v in result]
        }

    def get_value(self, info, *args, **kwargs):
        record = self.table.get(id=kwargs['id'])
        return record

    def insert_values(self, info, *args, **kwargs):
        record = self.table.create(**kwargs)
        record.save()

        return type(camel_case('add '+self.title), (), {
            self.title: model_to_dict(record)
        })

    def update_values(self, info, *args, **kwargs):
        record = self.table.get(id=kwargs['id'])
        del kwargs['id']

        for v in kwargs:
            setattr(record, v, kwargs[v])

        record.save()

        return type(camel_case('update '+self.title), (), {
            self.title: model_to_dict(record)
        })

    def delete_values(self, info, *args, **kwargs):
        record = self.table.get(id=kwargs['id'])
        record.delete_instance()
        
        return type(camel_case('delete '+self.title), (), {
            self.title: model_to_dict(record)
        })

class File:
    def __init__(self, project, user=None):
        self.project = project
        self.user = user

    def import_sheet(self, dataframe, name):
        headers = [header for header in dataframe.columns.tolist() if 'unnamed:' not in header.lower()]
            
        if 'id' in headers:
            headers.remove('id')

        worksheet_model = Worksheets(
            user= self.user,
            project=self.project,
            name=name
        )
        worksheet_model.save()

        formatted_headers = [camel_case(header) for header in headers]
        worksheet_class = Sheet(formatted_headers, worksheet_model.worksheet_id.hex, name, self.project)

        worksheet_class.create_table()

        for index, row in dataframe.iterrows():
            val = {}
            for header in headers:
                val[camel_case(header)] = row[header]

            try:
                del val['id']
            except:
                pass

            record = worksheet_class.table.create(**val)
            record.save()

    def import_sheets(self, file):
        if str(file.filename).endswith('.csv'):
            try:
                
                delimiter = ''
                encoding = 'utf-8'

                with open('media/'+str(file.file), 'r', errors="ignore") as myfile:
                    encoding = myfile.encoding
                    firstline = myfile.readline()
                    delimiter = detect(firstline)
                    myfile.close()

                dataframe = pd.read_csv('media/'+str(file.file), sep=delimiter, encoding=encoding, engine='python')
                
                if dataframe.shape[0] == 0:
                    raise APIException("Empty spreadsheet")

                self.import_sheet(dataframe, self.project.name)
            except Exception as e:
                raise APIException("Unable to import worksheet")

        elif str(file.filename).endswith('.xls') or str(file.filename).endswith('.xlsx'):
            try:
                if str(file.filename).endswith('.xls'):
                    spreadsheet = pd.ExcelFile('media/'+str(file.file), engine="xlrd")
                else:
                    spreadsheet = pd.ExcelFile('media/'+str(file.file), engine='openpyxl')

                worksheets = spreadsheet.sheet_names
                imported = 0

                for worksheet in worksheets:
                    dataframe = spreadsheet.parse(worksheet, index=False)

                    if dataframe.shape[0] != 0:
                        self.import_sheet(dataframe, worksheet)
                        imported += 1

                if imported == 0:
                    raise APIException("Empty spreadsheet")

            except Exception as e:
                raise APIException("Unable to import worksheet")

        else:
            raise APIException('Invalid file type')
        

    def worksheets(self):
        result = []
        worksheets = self.project.worksheets_set.all()
        
        for worksheet in worksheets:
            worksheet_id = worksheet.worksheet_id.hex
            
            try:
                conn = psycopg2.connect(
                    database = "worksheets", 
                    user = settings.DATABASES['default']['USER'],
                    password = settings.DATABASES['default']['PASSWORD'],
                    host = settings.DATABASES['default']['HOST'],
                    port = settings.DATABASES['default']['PORT']
                )
                cur = conn.cursor()

                cur.execute('Select * FROM public."'+worksheet_id+'" LIMIT 0')
                colnames = [desc[0] for desc in cur.description]
            except:
                raise APIException("Database connection error")

            return [Sheet(colnames, worksheet_id, worksheet.name, self.project)]
        
        return result
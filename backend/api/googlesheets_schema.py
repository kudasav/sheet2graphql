import graphene
from api.googlesheets_spreadsheet import *
from api.models import *
from api.graph.custom_scalars import filterField


types = {}


def list_resolver(worksheet):
    return lambda self, info, *args, **kwargs: worksheet.get_values(info, *args, **kwargs)


def object_resolver(worksheet):
    return lambda self, info, *args, **kwargs: worksheet.get_row(info, *args, **kwargs)


def get_parameters(worksheet, id=True, id_required=False, list_query=False, is_filter=False):
    fields = {}

    if is_filter:
        filter_params = {
            'lt': filterField(),
            'lte': filterField(),
            'gt': filterField(),
            'gte': filterField(),
            'eq': filterField(),
            'neq': filterField(),
        }

        filter_type = type('filterType', (graphene.InputObjectType,), filter_params)
        filter_fields = {}

        for value in worksheet.headers:
            if value != 'id':
                filter_fields[value] = filter_type()

        return filter_fields

    if id:
        fields['id'] = graphene.Int(required=id_required)

    for value in worksheet.headers:
        fields[value] = graphene.String()

    if list_query:
        object_type = type(camel_case(worksheet.title), (graphene.ObjectType,), fields)
        types[worksheet.title] = object_type

        if 'pagination' not in types:

            pagination_data = type('pagination', (graphene.ObjectType,), {
                'page': graphene.Int(),
                'pages': graphene.Int(),
                'count': graphene.Int(),
                'hasNext': graphene.Boolean(),
                'hasPrev': graphene.Boolean(),
            })
            types['pagination']= pagination_data

        return {
            'result': graphene.List(object_type),
            'pagination': graphene.Field(types['pagination'])
        }

    return fields

def get_queries(spreadsheet):
    values = {}

    for worksheet in spreadsheet.worksheets():
        
        graph_type = type(camel_case(worksheet.title+' list'), (graphene.ObjectType,), get_parameters(worksheet, list_query=True))
        query_input = type(camel_case(worksheet.title+' query'), (graphene.InputObjectType,), get_parameters(worksheet, id=False, is_filter=True))
        
        # retrieve a list of rows
        values[camel_case(worksheet.title+' list')] = graphene.Field(
            graph_type,
            page = graphene.Int(),
            limit = graphene.Int(),
            query = query_input()
        )

        values['resolve_'+camel_case(worksheet.title+' list')] = list_resolver(worksheet)

        # retrieve a single row
        values[camel_case(worksheet.title)] = graphene.Field(
            types[worksheet.title],
            id = graphene.Int(required=True)
        )

        values['resolve_'+camel_case(worksheet.title)] = object_resolver(worksheet)

    return values


# mutations
def add_mutation(worksheet):
    return lambda self, info, *args, **kwargs : worksheet.insert_values(info, *args, **kwargs)

def update_mutation(worksheet):
    return lambda self, info, *args, **kwargs : worksheet.update_values(info, *args, **kwargs)

def delete_mutation(worksheet):
    return lambda self, info, *args, **kwargs : worksheet.delete_values(info, *args, **kwargs)

def get_mutations(project, spreadsheet):
    values = {}

    for worksheet in spreadsheet.worksheets():
        # Add rows
        arguments = type('Arguments', (), get_parameters(worksheet, id=False))

        create = False
        update = False
        delete = False

        try:
            config = Worksheets.objects.get(googlesheets_id=worksheet.worksheet_id, project=project)
            create = config.create
            update = config.update
            delete = config.delete
        except:
            pass

        if create:
            properties = {
                camel_case(worksheet.title): graphene.Field(types[worksheet.title]),
                'Arguments': arguments,
                'mutate': add_mutation(worksheet)
            }

            add_function = type(camel_case('add '+worksheet.title), (graphene.Mutation,), properties)

            # retrieve a single row
            values[camel_case('add '+worksheet.title)] = add_function.Field()

        # Update rows
        if update:
            arguments = type('Arguments', (), get_parameters(worksheet, id_required=True))

            properties = {
                camel_case(worksheet.title): graphene.Field(types[worksheet.title]),
                'Arguments' : arguments,
                'mutate' : update_mutation(worksheet)
            }

            update_function = type(camel_case('update '+worksheet.title), (graphene.Mutation,), properties)
            values[camel_case('update '+worksheet.title)] = update_function.Field()

        
        # Delete rows
        if delete:
            arguments = type('Arguments', (), {
                'id': graphene.Int(required=True)
            })

            properties = {
                camel_case(worksheet.title) : graphene.Field(types[worksheet.title]),
                'Arguments' : arguments,
                'mutate' : delete_mutation(worksheet)
            }

            update_function = type(camel_case('delete '+worksheet.title), (graphene.Mutation,), properties)
            values[camel_case('delete '+worksheet.title)] = update_function.Field()

    return values


def googlesheets_schema(project):
    credentials = credentials_from_user(project.user)
    spreadsheet = Spreadsheet(project.spreadsheet_id, credentials, project)

    Query = type('Query', (graphene.ObjectType,), get_queries(spreadsheet))
    mutations = get_mutations(project, spreadsheet)

    if len(mutations) > 0:
        Mutations = type('Mutation', (graphene.ObjectType,), mutations)
        return graphene.Schema(query=Query, mutation=Mutations)
    else:
        return graphene.Schema(query=Query)
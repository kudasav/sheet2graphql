""" graphql query types and resolvers"""

from datetime import datetime
from api.utilities import get_paginator, APIException
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from api.googlesheets_spreadsheet import Spreadsheet
from api.file_spreadsheet import File
from api.file_spreadsheet import camel_case
from api.graph.input_types import *
from api.models import *
from api.graph.types import *
from api.email_templates import *

import graphene

User = get_user_model()

OBJECT_TYPE = """type {name} {{
    id: Int
    {fields}
}}

type filterType{{
    lt: filterField
    lte: filterField
    gt: filterField
    gte: filterField
    eq: filterField
    neq: filterField
}}

type {name}Query{{
    {filter_fields}
}}

type pagination {{
    page: Int
    pages: Int
    count: Int
    hasNext: Boolean
    hasPrev: Boolean
}}
"""

QUERIES = """
type Query {{
    {name}List(page: Int, limit: Int, query: {name}Query){{
        pagination: pagination
        results: [{name}]
    }},
    {name}(id: Int!): {name}
}}
"""

MUTATIONS = """
type Mutation {{
    {add}(
        {fields}
    ): {name}

    {update}(
        id: Int!,
        {fields}
    ): {name}

    {delete}(
        id: Int!
    ): {name}
}}
"""

LIST_QUERY = """query list{{
    {name}List{{
        id
        {fields}
    }}
}}
"""

GET_QUERY = """query get($id: Int!){{
    {name}(id: $id){{
        {name}{{
            id
            {fields}
        }}
    }}
}}
"""

CREATE_QUERY = """mutation add(
    {input_variables}
){{
    {operation}(
        {input_fields}
    ){{
        {name}{{
            id
            {fields}
        }}
    }}
}}
"""

UPDATE_QUERY = """mutation update(
    $id: Int!, 
    {input_variables}
){{
    {operation}(
        id: $id, 
        {input_fields}
    ){{
        {name}{{
            id
            {fields}
        }}
    }}
}}
"""

DELETE_QUERY = """mutation delete($id: Int!){{
    {operation}(id: $id){{
        {name}{{
            id
            {fields}
        }}
    }}
}}
"""

class Query(graphene.ObjectType):
    """ resolves graphql queries """

    user = graphene.Field(userType)
    projects = graphene.Field(
        projectsList,
        page=graphene.Int(default_value=1),
        limit=graphene.Int(default_value=10),
        query=projectQuery()
    )
    project = graphene.Field(
        projectType,
        id=graphene.String(required=True)
    )

    worksheetSchema = graphene.Field(
        worksheetType,
        worksheetId=graphene.String(required=True)
    )

    send_email = graphene.Field(
        graphene.String,
        name=graphene.String(required=True)
    )

    def resolve_user(self, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise APIException('Authorization credentials were not provided.')

        return user

    def resolve_projects(self, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise APIException('Authorization credentials were not provided.')

        if 'query' in kwargs and "name" in kwargs['query']:
            projects = user.projects_set.all().filter(name__startswith=kwargs['query']['name']).order_by('-name')
        else:
            projects = user.projects_set.all().order_by('-id')

        return get_paginator(projects, projectsList, page=kwargs['page'], limit=kwargs['limit'])

    def resolve_project(self, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise APIException('Authorization credentials were not provided.')

        project = get_object_or_404(Projects, project_id=kwargs['id'], user=user)
        return project

    def resolve_worksheetSchema(self, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise APIException('Authorization credentials were not provided.')

        sheet = get_object_or_404(Worksheets, worksheet_id=uuid.UUID(kwargs['worksheetId']), user=user)
        project = sheet.project
        
        if project.source == 'googleSheet':
            spreadsheetId = project.spreadsheet_id
            credentials = credentials_from_user(user)

            spreadsheet = Spreadsheet(spreadsheetId, credentials, project)

            worksheet = [worksheet for worksheet in spreadsheet.worksheets() if worksheet.worksheet_id == sheet.googlesheets_id]

            headers = [camel_case(header) for header in worksheet[0].headers]
            title = camel_case(worksheet[0].title)
        
        else:
            spreadsheet = File(project, user=user)
            worksheet = [worksheet for worksheet in spreadsheet.worksheets() if worksheet.worksheet_id == sheet.worksheet_id.hex]
            worksheet = worksheet[0]

            headers = worksheet.headers
            title = worksheet.title

        
        if 'id' in headers:
            headers.remove('id')
        
        params = [header+": String" for header in headers]
        params[0] = ''+params[0]

        query_fields = "\n    ".join(params)

        filter_fields = [header+": filterType" for header in headers]
        filter_fields = "\n    ".join(filter_fields)

        schema_type = OBJECT_TYPE.format(name=title, fields=query_fields, filter_fields=filter_fields)
        shema_queries = QUERIES.format(name=title)

        mutation_fields = "\n        ".join(params)
        schema_mutations = MUTATIONS.format(
            add=camel_case('add '+title),
            update=camel_case('update '+title), 
            delete=camel_case('delete '+title),  
            name=title,
            fields=mutation_fields
        )

        result = schema_type+shema_queries+schema_mutations
        
        # sample QUERIES

        # list rows
        sample_fields = "\n        ".join(headers)
        list_sample = LIST_QUERY.format(name=title, fields=sample_fields)
        
        # get row
        sample_fields = query_fields = "\n            ".join(headers)
        get_sample = GET_QUERY.format(name=title, fields=sample_fields)
        
        # insert row
        input_variables = ['$'+field+': String' for field in headers]
        input_variables = ",\n    ".join(input_variables)

        input_fields = [field+': $'+field for field in headers]
        input_fields = ",\n        ".join(input_fields)

        create_sample = CREATE_QUERY.format(
            name=title,
            operation=camel_case('add '+title),
            input_variables=input_variables,
            input_fields=input_fields,
            fields = sample_fields
        )

        update_sample = UPDATE_QUERY.format(
            name=title,
            operation=camel_case('update '+title),
            input_variables=input_variables,
            input_fields=input_fields,
            fields = sample_fields
        )

        delete_sample = DELETE_QUERY.format(
            name=title,
            operation=camel_case('delete '+title),
            fields=sample_fields
        )

        return {
            'schema': result,
            'list_sample': list_sample,
            'get_sample': get_sample,
            'create_sample': create_sample,
            'update_sample': update_sample,
            'delete_sample': delete_sample,
            'create': sheet.create,
            'update': sheet.update,
            'delete': sheet.delete,
            'worksheet_id': sheet.worksheet_id,
            'name': title
        }

    def resolve_send_email(self, info, **kwargs):
        body = WELCOME_EMAIL.format(name=kwargs['name'])
        send_email(body, 'Welcome to Sheet2GraphQL', 'savanhu.k@yahoo.com', 'Kuda Savanhu <kuda@savanhu.io>')
        return 'ok'
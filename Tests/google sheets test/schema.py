import graphene
from spreadsheet import *

types = {}

def list_resolver(worksheet):
    return lambda self, info, *args, **kwargs : worksheet.get_values(*args, **kwargs)

def object_resolver(worksheet):
    return lambda self, info, *args, **kwargs : worksheet.get_row(*args, **kwargs)

def get_parameters(worksheet, id=True, id_required=False):

    fields = {}
    if id:
        fields['id'] = graphene.Int(required=id_required)

    for value in worksheet.headers:
        fields[value] = graphene.String()

    return fields

def get_queries():
    spreadsheet = Spreadsheet('1bcQtycw_IYLMhR2ueTP8HvMLSAj7pOVKYYF-tNorfDM')
    values = {}

    for worksheet in spreadsheet.worksheets():

        graph_type = type(worksheet.title, (graphene.ObjectType,), get_parameters(worksheet))
        types[worksheet.title] = graph_type

        # retrieve a list of rows
        values[worksheet.title+'List'] = graphene.List(
            graph_type,
            page = graphene.Int(),
            limit = graphene.Int()
        )

        values['resolve_'+worksheet.title+'List'] = list_resolver(worksheet)

        # retrieve a single row
        values[worksheet.title] = graphene.Field(
            graph_type,
            id = graphene.Int(required=True)
        )

        values['resolve_'+worksheet.title] = object_resolver(worksheet)

    return values


# mutations
def add_mutation(worksheet):
    return lambda self, info, *args, **kwargs : worksheet.insert_values(*args, **kwargs)

def update_mutation(worksheet):
    return lambda self, info, *args, **kwargs : worksheet.update_values(*args, **kwargs)

def delete_mutation(worksheet):
    return lambda self, info, *args, **kwargs : worksheet.delete_values(*args, **kwargs)

def get_mutations():
    values = {}
    spreadsheet = Spreadsheet('1bcQtycw_IYLMhR2ueTP8HvMLSAj7pOVKYYF-tNorfDM')

    for worksheet in spreadsheet.worksheets():

        # Add rows
        arguments = type('Arguments', (), get_parameters(worksheet, id=False))

        properties = {
            worksheet.title : graphene.Field(types[worksheet.title]),
            'Arguments' : arguments,
            'mutate' : add_mutation(worksheet)
        }

        add_function = type(camel_case('add '+worksheet.title), (graphene.Mutation,), properties)

        # retrieve a single row
        values['add'+worksheet.title] = add_function.Field()


        # Update rows
        arguments = type('Arguments', (), get_parameters(worksheet, id_required=True))

        properties = {
            worksheet.title : graphene.Field(types[worksheet.title]),
            'Arguments' : arguments,
            'mutate' : update_mutation(worksheet)
        }

        update_function = type(camel_case('update '+worksheet.title), (graphene.Mutation,), properties)
        values[camel_case('update '+worksheet.title)] = update_function.Field()

        
        # Delete rows
        arguments = type('Arguments', (), {
            'id': graphene.Int(required=True)
        })

        properties = {
            worksheet.title : graphene.Field(types[worksheet.title]),
            'Arguments' : arguments,
            'mutate' : delete_mutation(worksheet)
        }

        update_function = type(camel_case('delete '+worksheet.title), (graphene.Mutation,), properties)
        values[camel_case('delete '+worksheet.title)] = update_function.Field()

    return values

Query = type('Query', (graphene.ObjectType,), get_queries())
print(types)
Mutations = type('Mutation', (graphene.ObjectType,), get_mutations())
schema = graphene.Schema(query=Query, mutation=Mutations)
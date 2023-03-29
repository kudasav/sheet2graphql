from django.conf import settings
import graphene

class projectInput(graphene.InputObjectType):
    name = graphene.String()
    source = graphene.String()
    url = graphene.String()
    uploadId = graphene.String()
    introspection = graphene.Boolean()

class projectQuery(graphene.InputObjectType):
    name = graphene.String()
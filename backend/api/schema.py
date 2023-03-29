from ast import arg
import graphene
from api.graph.queries import *
from api.graph.mutations import Mutation

api_schema = graphene.Schema(query=Query, mutation=Mutation)
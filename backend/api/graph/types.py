import graphene
from api.models import *
from graphene_django.types import DjangoObjectType
from django.contrib.auth import get_user_model
from api.graph.input_types import *
from api.utilities import *
from api.googlesheets_spreadsheet import Spreadsheet, credentials_from_user
from api.file_spreadsheet import File
from django.utils import timezone
from datetime import datetime

User = get_user_model()

class worksheetType(graphene.ObjectType):
    worksheet_id = graphene.String()
    name = graphene.String()
    schema = graphene.String()
    list_sample = graphene.String()
    get_sample = graphene.String()
    
    create = graphene.Boolean()
    create_sample = graphene.String()

    update = graphene.Boolean()
    update_sample = graphene.String()

    delete = graphene.Boolean()
    delete_sample = graphene.String()

class projectType(DjangoObjectType):
    worksheets = graphene.List(worksheetType)

    def resolve_worksheets(self, info):
        user = info.context.user 

        if not user:
            return []
        
        result = []

        if self.source == 'googleSheet':
            credentials = credentials_from_user(user)
            spreadsheet = Spreadsheet(self.spreadsheet_id, credentials, self)
            sheets = [worksheet for worksheet in spreadsheet.worksheets()]

            for sheet in sheets:
                try:
                    sheet = Worksheets.objects.get(googlesheets_id=sheet.worksheet_id, project=self)
                except Exception as e:
                    sheet = Worksheets(
                        user=user,
                        project=self,
                        googlesheets_id=sheet.worksheet_id,
                        name=sheet.title
                    )

                    sheet.save()
                
                result.append(sheet)
        else:
            result = [worksheet for worksheet in self.worksheets_set.all()]

        return result

    class Meta:
        model = Projects

class projectsList(graphene.ObjectType):
    page = graphene.Int()
    pages = graphene.Int()
    count = graphene.Int()
    has_next = graphene.Boolean()
    has_prev = graphene.Boolean()
    result = graphene.List(projectType)

class userType(DjangoObjectType):

    class Meta:
        model = User
        exclude = ("password",)

class subscriptionType(DjangoObjectType):

    class Meta:
        model = Subscriptions
import requests, graphene, jwt, json
from api.models import *
from api.graph.types import *
from graphql_jwt.shortcuts import get_token
from django.contrib.auth import get_user_model
from api.graph.input_types import *
from api.utilities import APIException
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.shortcuts import get_object_or_404
from chunked_upload.models import ChunkedUpload
from api.googlesheets_spreadsheet import Spreadsheet, credentials_from_user
from api.file_spreadsheet import File, database
from datetime import timedelta
from django.conf import settings
from api.email_templates import *
from googleapiclient.errors import HttpError
import threading

User = get_user_model()


class login(graphene.Mutation):
    token = graphene.String()
    user = graphene.Field(userType)

    class Arguments:
        token = graphene.String(required=True)

    def mutate(self, info, **kwargs):
        # request the oauth data using the provided oauth code
        data = {
            "client_id": settings.CLIENT_ID,
            "client_secret": settings.CLIENT_SECRET,
            "redirect_uri": settings.REDIRECT_URI,
            "code": kwargs['token'],
            "grant_type": "authorization_code"
        }

        try:
            token_request = requests.post('https://oauth2.googleapis.com/token', data=data)
        except:
            return APIException('Unable to connect to Google, Please try again later.')

        oauth_data = token_request.json()

        if 'id_token' not in oauth_data:
            return APIException('Unable to sign in with Google, Please try again later.')

        # decode the user data payload
        data = jwt.decode(oauth_data['id_token'], options={"verify_signature": False})

        # check if user exists
        if not User.objects.filter(email=data['email']).exists():
            user = User(
                email = data['email'], 
                secondary_email = data['email'],
                full_name = data['name'],
                given_name = data['given_name'], 
                family_name = data['family_name']
            )

            if "picture" in data:
                user.picture = data['picture']

            user.save()

            date_now = timezone.now()
            renews = date_now + timedelta(days=30)

            subscription = Subscriptions(
                user = user,
                name = "free",
                quota = 600,
                renews = renews
            )

            subscription.save()

            # send welcome email
            # user_name = ""
            # if 'given_name' in data:
            #     user_name = data['given_name'].title()

            # email_body = WELCOME_EMAIL.format(name=user_name)
            # send_email(email_body, 'Welcome to Sheet2GraphQL', data['email'], 'Kuda Savanhu <kuda@sheet2graphql.co>')

        else:
            user = User.objects.get(email=data['email'])

            # update the user's profile picture
            if "picture" in data:
                user.picture = data['picture']

            user.save()

        expires_in = timezone.now() + timedelta(seconds=oauth_data['expires_in'])
        if(hasattr(user, "oauthtokens")):
            # update the stored token
            oauthtoken = user.oauthtokens
            oauthtoken.token = oauth_data["access_token"]
            oauthtoken.expires = expires_in

            if "refresh_token" in oauth_data:
                oauthtoken.refresh_token = oauth_data["refresh_token"]

            oauthtoken.updated = timezone.now()
            oauthtoken.save()

        else:
            if "refresh_token" not in oauth_data:
                return APIException('Unable to obtain refresh token from your Google account. Please remove Sheet2GraphQL from third party apps and try again, https://support.google.com/accounts/answer/3466521?hl=en')

            # store the user's token
            user_token = oauthTokens(
                user = user,
                token = oauth_data["access_token"],
                expires = expires_in,
                refresh_token= oauth_data["refresh_token"]
            )
            user_token.save()

        token = get_token(user)
        return login(token=token, user=user)

class update_user(graphene.Mutation):
    user = graphene.Field(userType)

    class Arguments:
        secondary_email = graphene.String(required=True)

    def mutate(self, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise APIException('Authorization credentials were not provided.')

        user.secondary_email = kwargs['secondary_email']
        user.save()

        return update_user(user=user)

class delete_user(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        pass

    def mutate(self, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise APIException('Authorization credentials were not provided.')

        credentials = credentials_from_user(user)

        try:
            requests.get('https://accounts.google.com/o/oauth2/revoke?token={token}'.format(token=credentials['refresh_token']))
        except:
            return APIException('Unable revoke your oauth token, Please try again later.')

        projects = user.projects_set.all().order_by('-id')
        for project in projects:
            if project.source == 'file':
                spreadsheet = File(project)
                worksheets = spreadsheet.worksheets()

                tables = [worksheet.table for worksheet in worksheets]
                database.drop_tables(tables, safe=True)
        
        user.delete()

        return delete_user(success=True)

class add_project(graphene.Mutation):
    project = graphene.Field(projectType)

    class Arguments:
        properties = projectInput(required=True)

    def mutate(self, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise APIException('Authorization credentials were not provided.')

        if kwargs['properties']['source'] == 'googleSheet':
            spreadsheet_id = kwargs['properties']['url'].strip().split('spreadsheets/d/')[1].split('/')[0]
            del kwargs['properties']['url']

            credentials = credentials_from_user(user)
            kwargs['properties']['spreadsheet_id'] = spreadsheet_id

            project = Projects(user=user, **kwargs['properties'])
            project.save()
            spreadsheet = Spreadsheet(spreadsheet_id, credentials, project=project)

            try:
                sheets = spreadsheet.worksheets()
            except Exception as e:
                project.delete()
                if isinstance(e, HttpError):
                    content = json.loads(e.content)
                    if content["error"]["status"] == "PERMISSION_DENIED":
                        raise APIException('Insufficient permisions.')

                raise APIException('Unable to connect to Google APIs, Please try again later.')

            for sheet in sheets:
                sheet = Worksheets(
                    user=user,
                    project=project,
                    googlesheets_id=sheet.worksheet_id,
                    name=sheet.title
                )

                sheet.save()
        else:
            file = get_object_or_404(ChunkedUpload, upload_id=kwargs['properties']['uploadId'])
            project = Projects(
                user=user,
                name=kwargs['properties']['name'],
                source='file'
            )
            project.save()
            
            try:
                spreadsheet = File(project, user=user)
                spreadsheet.import_sheets(file)
            except Exception as e:
                project.delete()

                raise e  

        return add_project(project=project)

class update_worksheet(graphene.Mutation):
    worksheet = graphene.Field(worksheetType)

    class Arguments:
        worksheet_id = graphene.String(required=True)
        create = graphene.Boolean()
        update = graphene.Boolean()
        delete = graphene.Boolean()

    def mutate(self, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise APIException('Authorization credentials were not provided.')

        worksheet_id = kwargs['worksheet_id']
        del kwargs['worksheet_id']

        worksheet = get_object_or_404(Worksheets, worksheet_id=worksheet_id)
        if worksheet.user != user:
            raise APIException('You do not have permission to perform this action.')

        Worksheets.objects.filter(worksheet_id=worksheet_id, user=user).update(**kwargs)
        worksheet = get_object_or_404(Worksheets, worksheet_id=worksheet_id)

        return update_worksheet(worksheet=worksheet)

class update_project(graphene.Mutation):
    project = graphene.Field(projectType)

    class Arguments:
        project_id = graphene.String(required=True)
        name = graphene.String()
        introspection = graphene.Boolean()
        authentication = graphene.Boolean()
        bearer = graphene.String()

    def mutate(self, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise APIException('Authorization credentials were not provided.')

        project_id = kwargs['project_id']
        del kwargs['project_id']

        project = get_object_or_404(Projects, project_id=project_id)
        if project.user != user:
            raise APIException('You do not have permission to perform this action.')

        if 'authentication' in kwargs and kwargs['authentication'] and 'bearer' not in kwargs:
            raise APIException('bearer token required')

        Projects.objects.filter(project_id=project_id).update(**kwargs)
        project = get_object_or_404(Projects, project_id=project_id)

        return update_project(project=project)

class delete_project(graphene.Mutation):
    project = graphene.Field(projectType)

    class Arguments:
        project_id = graphene.String(required=True)

    def mutate(self, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise APIException('Authorization credentials were not provided.')

        project_id = kwargs['project_id']

        project = get_object_or_404(Projects, project_id=project_id)
        if project.user != user:
            raise APIException('You do not have permission to perform this action.')

        if project.source == 'file':
            spreadsheet = File(project)
            worksheets = spreadsheet.worksheets()

            tables = [worksheet.table for worksheet in worksheets]
            database.drop_tables(tables, safe=True)
        
        # return None
        project = get_object_or_404(Projects, project_id=project_id)
        project.delete()

        return delete_project(project=project)


class Mutation(graphene.ObjectType):
    login = login.Field()
    update_user = update_user.Field()
    delete_user = delete_user.Field()

    add_project = add_project.Field()
    update_project = update_project.Field()
    delete_project = delete_project.Field()

    update_worksheet = update_worksheet.Field()

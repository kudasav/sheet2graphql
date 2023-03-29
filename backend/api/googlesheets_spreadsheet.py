from __future__ import print_function
import os.path, json, re, graphene
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from django.utils import timezone
from django.conf import settings
from datetime import timedelta, datetime
from api.utilities import get_paginator, APIException
import requests, math


def camel_case(s):
    s = re.sub(r"(_|-)+", " ", s).title().replace(" ", "")
    return ''.join([s[0].lower(), s[1:]])

class Worksheet:
    def __init__(self, title, sheetId, spreadsheet_id, api, project):
        self.title = title
        self.spreadsheet_id = spreadsheet_id
        self.worksheet_id = sheetId
        self.api = api
        self.project = project
        self.headers = self.get_headers()

    def get_headers(self):
        request = self.api.values().get(
            spreadsheetId=self.spreadsheet_id,
            range=self.title+'!1:1'
        ).execute()

        response = request.get('values', [])
        return [camel_case(header) for header in response[0] if header and len(header) != 0]

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

    def search_list(self, target_list, query):
        lt = {}
        lte = {}
        gt = {}
        gte = {}
        eq = {}
        neq = {}
        
        for v in query:
            for operation in query[v]:
                if operation == 'lt':
                    lt[v] = query[v][operation]

                if operation == 'lte':
                    lte[v] = query[v][operation]

                if operation == 'gt':
                    gt[v] = query[v][operation]

                if operation == 'gte':
                    gte[v] = query[v][operation]

                if operation == 'eq':
                    eq[v] = query[v][operation]

                if operation == 'neq':
                    neq[v] = query[v][operation]

        result = []

        for i, v in lt.items():
            try:
                value = float(target_list[self.headers.index(i)])
                result.append(value < v)
            except:
                continue

        for i, v in lte.items():
            try:
                value = float(target_list[self.headers.index(i)])
                result.append(value <= v)
            except:
                continue

        for i, v in gt.items():
            try:
                value = float(target_list[self.headers.index(i)])
                result.append(value > v)
            except:
                continue

        for i, v in gte.items():
            try:
                value = float(target_list[self.headers.index(i)])
                result.append(value >= v)
            except:
                continue

        result += [target_list[self.headers.index(i)] == str(v) for i, v in eq.items()]
        result += [target_list[self.headers.index(i)] != str(v) for i, v in neq.items()]
        
        return False not in result

    def get_filtered_values(self, kwargs):
        page = 1
        limit = 10

        if 'limit' in kwargs:
            limit = kwargs['limit']

        if 'page' in kwargs:
            page = kwargs['page']

        offset = (page - 1) * limit

        request = self.api.values().get(
            spreadsheetId=self.spreadsheet_id,
            range=self.title
        ).execute()

        response = request.get('values', [])
        
        matches = [{'value': value, 'index': index} for index, value in enumerate(response) if self.search_list(value, kwargs['query'])]
        result_count = len(matches)
        matches = matches[offset:offset+limit]
        result = []

        for value in matches:
            data = dict(zip(self.headers, value['value']))
            data['id'] = value['index'] + 1
            result.append(data)

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
            "result": result
        }

    def get_values(self, info, *args, **kwargs):
        if "query" in kwargs:
            return self.get_filtered_values(kwargs)

        values_range = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[len(self.headers)-1]
        page = 1
        limit = 10

        if 'limit' in kwargs:
            limit = kwargs['limit']

        if 'page' in kwargs:
            page = kwargs['page']

        if limit == 1:
            a1_notation = 'A'+str(page)+':'+values_range+str(page)
            id = page
        else:
            # retrieve the next range of rows
            lm = (page * limit) + 1

            # add one to the offset to skip the header row
            offset = (lm+1) - limit
            
            id = offset
            a1_notation = 'A'+str(offset)+':'+values_range+str(lm)

        request = self.api.values().get(
            spreadsheetId=self.spreadsheet_id,
            range=self.title+'!'+a1_notation
        ).execute()

        response = request.get('values', [])

        result = []

        for value in response:
            data = dict(zip(self.headers, value))
            data['id'] = id
            result.append(data)

            id+=1

        # calculate pagination
        # calculate pagination
        body = {
            'majorDimension': 'ROWS',
            'values': []
        }
        insert_result = self.api.values().append(
            spreadsheetId=self.spreadsheet_id,
            range=self.title+'!A:A',
            insertDataOption='INSERT_ROWS',
            valueInputOption='USER_ENTERED',
            body=body
        ).execute()

        workheet_range = insert_result.get('tableRange')
        last_row = int(workheet_range.split(':')[1][1:])
        result_count = last_row - 1

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
            "result": result
        }

    def get_row(self, info, *args, **kwargs):
        request = self.api.values().get(
            spreadsheetId=self.spreadsheet_id,
            range=self.title+'!'+str(kwargs['id'])+':'+str(kwargs['id'])
        ).execute()

        response = request.get('values', [])
        result = dict(zip(self.headers, response[0]))
        result['id'] = kwargs['id']

        return result

    def insert_values(self, info, *args, **kwargs):
        values = []

        for v in self.headers:
            if v not in kwargs:
                values.append('')
            else:
                values.append(kwargs[v])

        body = {
            'values': [values]
        }
        result = self.api.values().append(
            spreadsheetId=self.spreadsheet_id,
            range=self.title+'!A:A',
            insertDataOption='INSERT_ROWS',
            valueInputOption='USER_ENTERED',
            body=body
        ).execute()

        range = result.get('tableRange')
        id = int(range.split(':')[1][1:])

        result = dict(zip(self.headers, values))
        result['id'] = id + 1

        # we need to return an object containg the result
        return type(camel_case('add '+self.title), (), {
            camel_case(self.title): result
        })

    def update_values(self, info, *args, **kwargs):
        a1_range = self.title+'!'+str(kwargs['id'])+':'+str(kwargs['id'])
        request = self.api.values().get(
            spreadsheetId=self.spreadsheet_id,
            range=a1_range
        ).execute()

        values = request.get('values', [])[0]

        for v in self.headers:
            if v in kwargs:
                index = self.headers.index(v)
                values[index] =  kwargs[v]

        body = {
            'values': [values]
        }

        result = self.api.values().update(
            spreadsheetId=self.spreadsheet_id, 
            range=a1_range,
            valueInputOption='USER_ENTERED', 
            body=body
        ).execute()
        
        result = dict(zip(self.headers, values))
        result['id'] = kwargs['id']

        return type(camel_case('update '+self.title), (), {
            camel_case(self.title): result
        })

    def delete_values(self, info, *args, **kwargs):
        request = self.api.values().get(
            spreadsheetId=self.spreadsheet_id,
            range=self.title+'!'+str(kwargs['id'])+':'+str(kwargs['id'])
        ).execute()

        row = request.get('values', [])
        row = dict(zip(self.headers, row[0]))
        row['id'] = kwargs['id']

        requests = [{
            "deleteDimension": {
                "range": {
                    "sheetId": self.worksheet_id,
                    "dimension": "ROWS",
                    "startIndex": kwargs['id']-1,
                    "endIndex": kwargs['id']
                }
            }
        }]

        body = {
            'requests': requests
        }
        response = self.api.batchUpdate(
            spreadsheetId=self.spreadsheet_id,
            body=body).execute()

        find_replace_response = response.get('replies')

        return type(camel_case('delete '+self.title), (), {
            camel_case(self.title): row
        })

class Spreadsheet:
    def __init__(self, id, credentials, project):
        self.creds = Credentials.from_authorized_user_info(credentials, ['https://www.googleapis.com/auth/spreadsheets'])
        self.project = project

        self.spreadsheet_id = id
        service = build('sheets', 'v4', credentials=self.creds)
        self.api = service.spreadsheets()

    def worksheets(self):
        request = self.api.get(spreadsheetId=self.spreadsheet_id, ranges=[], includeGridData=False)
        response = request.execute()

        result = []
        for worksheet in response["sheets"]:
            result.append(
                Worksheet(
                    worksheet["properties"]["title"],
                    worksheet["properties"]["sheetId"], 
                    self.spreadsheet_id, 
                    self.api,
                    self.project
                )
            )

        return result

def credentials_from_user(user):
    oauthtoken = user.oauthtokens

    # check if the access token is expired and return oauth data
    if oauthtoken.expires > timezone.now():
        credentials = {
            "token": oauthtoken.token,
            "refresh_token": oauthtoken.refresh_token,
            "token_uri": "https://oauth2.googleapis.com/token",
            "client_id": settings.CLIENT_ID,
            "client_secret": settings.CLIENT_SECRET,
            "scopes": ["https://www.googleapis.com/auth/spreadsheets"],
            "expiry": oauthtoken.expires.strftime("%Y-%m-%dT%H:%M:%S")
        }

        return credentials
    
    # get a new access token using the users refresh token
    else:
        data = {
            "client_id": settings.CLIENT_ID,
            "client_secret": settings.CLIENT_SECRET,
            "refresh_token": oauthtoken.refresh_token,
            "grant_type": "refresh_token"
        }

        token_request = requests.post('https://www.googleapis.com/oauth2/v4/token', data=data)
        oauth_data = token_request.json()
        expires_in = timezone.now() + timedelta(seconds=oauth_data['expires_in'])

        oauthtoken.token = oauth_data["access_token"]
        oauthtoken.expires = expires_in
        oauthtoken.updated = timezone.now()
        oauthtoken.save()

        return {
            "token": oauth_data["access_token"],
            "refresh_token": oauthtoken.refresh_token,
            "token_uri": "https://oauth2.googleapis.com/token",
            "client_id": settings.CLIENT_ID,
            "client_secret": settings.CLIENT_SECRET,
            "scopes": ["https://www.googleapis.com/auth/spreadsheets"],
            "expiry": expires_in.strftime("%Y-%m-%dT%H:%M:%S")
        }
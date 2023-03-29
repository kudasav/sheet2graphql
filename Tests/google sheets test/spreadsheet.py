from __future__ import print_function

import os.path
import json
import re
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

creds = None

if os.path.exists('token.json'):
    creds = Credentials.from_authorized_user_file('token.json', SCOPES)

# If there are no (valid) credentials available, let the user log in.
if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
    else:
        flow = InstalledAppFlow.from_client_secrets_file('cred.json', SCOPES)
        creds = flow.run_local_server(port=0)

    # Save the credentials for the next run
    with open('token.json', 'w') as token:
        token.write(creds.to_json())


def camel_case(s):
    s = re.sub(r"(_|-)+", " ", s).title().replace(" ", "")
    return ''.join([s[0].lower(), s[1:]])


class Worksheet:
    """Class representing a person"""

    def __init__(self, title, sheetId, spreadsheet_id, api):
        self.title = title
        self.spreadsheet_id = spreadsheet_id
        self.sheetId = sheetId
        self.api = api
        self.headers = self.get_headers()

    def get_headers(self):
        request = self.api.values().get(
            spreadsheetId=self.spreadsheet_id,
            range=self.title+'!1:1'
        ).execute()

        response = request.get('values', [])
        return [camel_case(header) for header in response[0]]

    def get_values(self, *args, **kwargs):
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

            id += 1

        return result

    def get_row(self, *args, **kwargs):
        request = self.api.values().get(
            spreadsheetId=self.spreadsheet_id,
            range=self.title+'!'+str(kwargs['id'])+':'+str(kwargs['id'])
        ).execute()

        response = request.get('values', [])
        result = dict(zip(self.headers, response[0]))
        result['id'] = kwargs['id']

        return result

    def insert_values(self, *args, **kwargs):

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
            self.title: result
        })

    def update_values(self, *args, **kwargs):
        a1_range = self.title+'!'+str(kwargs['id'])+':'+str(kwargs['id'])
        request = self.api.values().get(
            spreadsheetId=self.spreadsheet_id,
            range=a1_range
        ).execute()

        values = request.get('values', [])[0]

        for v in self.headers:
            if v in kwargs:
                index = self.headers.index(v)
                values[index] = kwargs[v]

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
            self.title: result
        })

    def delete_values(self, *args, **kwargs):
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
                    "sheetId": self.sheetId,
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
            self.title: row
        })


class Spreadsheet:
    """Class representing a person"""

    def __init__(self, id):
        self.spreadsheet_id = id
        self.service = build('sheets', 'v4', credentials=creds)
        self.api = self.service.spreadsheets()

    def worksheets(self):
        request = self.api.get(
            spreadsheetId=self.spreadsheet_id, ranges=[], includeGridData=False)
        response = request.execute()
        o = open("res.json", "w")
        json.dump(response, o)
        o.close()

        return [Worksheet(worksheet["properties"]["title"], worksheet["properties"]["sheetId"], self.spreadsheet_id, self.api) for worksheet in response["sheets"]]

    def worksheet(self, title):
        request = self.api.values().get(
            spreadsheetId=self.spreadsheet_id,
            range=title+'!1:1'
        ).execute()

        response = request.get('values', [])
        print(response)


sheet = Spreadsheet('1bcQtycw_IYLMhR2ueTP8HvMLSAj7pOVKYYF-tNorfDM')



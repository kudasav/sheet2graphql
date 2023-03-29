from __future__ import print_function

import os.path, json
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

# The ID and range of a sample spreadsheet.
SAMPLE_SPREADSHEET_ID = '1bcQtycw_IYLMhR2ueTP8HvMLSAj7pOVKYYF-tNorfDM'
SAMPLE_RANGE_NAME = 'Schools!1:1'



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


service = build('sheets', 'v4', credentials=creds)

# Call the Sheets API
spreadsheets = service.spreadsheets()

# request = service.spreadsheets().get(spreadsheetId=SAMPLE_SPREADSHEET_ID, ranges=[], includeGridData=False)
# response = request.execute()

# json.dump(response, open('res.json', 'w'))


# result = spreadsheets.values().get(spreadsheetId=SAMPLE_SPREADSHEET_ID,range=SAMPLE_RANGE_NAME).execute()
# values = result.get('values', [])


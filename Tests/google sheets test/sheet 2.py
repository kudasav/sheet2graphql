import gspread, re
import pandas as pd
from oauth2client.service_account import ServiceAccountCredentials
from string import ascii_lowercase

scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']

# add credentials to the account
creds = ServiceAccountCredentials.from_json_keyfile_name('credentials service.json', scope)

# authorize the clientsheet 
client = gspread.authorize(creds)

# get the instance of the Spreadsheet
spreadsheet = client.open_by_key('1bcQtycw_IYLMhR2ueTP8HvMLSAj7pOVKYYF-tNorfDM')
worksheet = spreadsheet.worksheets()[0]

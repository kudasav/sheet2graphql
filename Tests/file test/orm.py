from peewee import *
import pandas as pd

database = PostgresqlDatabase(
    'worksheets', 
    user='root', 
    password='7C28hLdGiS2R40jPQ1C8',
    host='127.0.0.1', 
    port=5432
)

# read file
# get worksheets
# create woorksheets model
# import sheet into worksheets database using worksheet model uuid

# meta = type('Meta', (), {'database': database})
# m = type('Sheet1', (Model,), {
#     'email': CharField(),
#     'Meta': meta
# })

# database.create_tables([m])

class File:
    def __init__(self, file):
        self.spreadsheet = pd.ExcelFile(file, engine='openpyxl')
        self.workshets = self.spreadsheet.sheet_names

    def get_headers(self):
        pass

    def import_sheets(self, project):
        pass
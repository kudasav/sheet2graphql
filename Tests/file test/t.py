from detect_delimiter import detect
import psycopg2, json
import pandas as pd

file = "lawyers.csv"
encoding = 'utf-8'

with open(file) as f:
   print(f)

with open(str(file), 'r') as myfile:
    encoding = myfile.encoding
    firstline = myfile.readline()
    delimiter = detect(firstline)
    myfile.close()


print(delimiter)
spreadsheet = pd.read_csv(file, sep=delimiter, encoding=encoding)
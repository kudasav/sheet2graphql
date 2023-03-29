import pygsheets

gc = pygsheets.authorize(service_file='client_secret.json')
worksheet = gc.open('Sign Up').sheet1
cells = worksheet.get_all_values(include_tailing_empty_rows=False, include_tailing_empty=False, returnas='matrix')
end_row = len(cells)
print(end_row)
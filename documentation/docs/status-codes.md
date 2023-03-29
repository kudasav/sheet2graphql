# Status Codes

Status Code | Meaning
---------- | -------
200 - OK   | Everything worked as expected.
400 - Bad Request | The request was unacceptable, often due to missing a required parameter or permission to the spreadsheet.
401 - Authentication Failed	| Incorrect authentication credentials
402 - Payment Required	| This operation is not allowed in your current plan.
403 - Forbidden	| You do not have permission to perform this action.
404 - Not Found	| The requested resource doesn't exist.
405 - Method Not Allowed |	When calling a endpoint using a not registered method. Ex: POST for the search endpoint
402 - Payment required |	You already used all of your plan's requests this month.
500, 502, 503, 504 - Server Errors	| Something went wrong on our end, we will fix it.
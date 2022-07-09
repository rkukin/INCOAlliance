# INCOAlliance

How to launch test:
1. install dependencies with `npm i`
2. run tests with `npm tests`

Report with test results will be generated in `mochawesome-report/mochawesome.html`

List of bugs:
Documentation bugs:
1. POST methods documentation mismatch the RESTful API best practices
Expected result: POST method add a new record
Actual result: POST method updates existing data

2. PUT methods documentation mismatch the RESTful API best practices
Expected result: PUT method updates existing data
Actual result: PUT method add a new record

3. It is not recommended to send data in request body for DELETE method https://datatracker.ietf.org/doc/html/rfc7231#section-4.3.5
Expected result: Key for DELETE method send in query params
Actual result: Key for DELETE method send in request body

4. Not clear what the return value for PUT and DELETE method
Expected result: PUT and DELETE methods should return edited or deleted object with main_key and value
Actual result: As per description of returned value in doc, PUT should return updated value, DELETE should return deleted value

Implementation bugs:
1. POST methods update the record instead of create new record which is mismatch RESTful API semantic
Expected result: POST method add a new record
Actual result: POST method updates existing data

2. PUT methods create the record instead of update existing record which is mismatch RESTful API semantic
Expected result: PUT method updates existing data
Actual result: PUT method add a new record

3. Max number of records grater than in documentation
Expected result: Max number of records limited by 10 records
Actual result: Can be added 11 records

4. Empty value can't be set when editing record
Expected result: Empty value can be set when editing record
Actual result: Validation error, record can't be edited with empty value

5. Invalid data type can be passed as value when edit or add record
Expected result: Validation error when passing value different from string when edit or add record
Actual result: No validation error when passing an array as a value when edit or add record

6. Invalid data type can be passed as main_key when delete record
Expected result: Validation error when passing value different from string when delete record
Actual result: No validation error when passing an array as a value when delete record

7. No validation for DELETE method when passing not existing main_key
Expected result: Validation error when passing not existing main_key when delete record
Actual result: No validation error when passing not existing main_key when delete record

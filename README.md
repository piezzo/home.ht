# The Challenge 💪

The goal of this challenge is to build an API for updating and fetching data about a tenant's payment history.

Here is how the data should be structured:
```
    {
    "sum": 0,
    "items": [{
    "id":1366,
    "contractId":17689,
    "description":"Rent payment",
    "value":100,
    "time":"2016-12-09T00:00:00.00Z",
    "isImported":false,
    "createdAt":"2016-12-09T12:57:31.393Z",
    "updatedAt":"2016-12-09T12:57:31.393Z",
    "isDeleted":false
    }, {
    "id":1365,
    "contractId":17689,
    "description":"Rent to be paid",
    "value":-100,
    "time":"2016-12-09T00:00:00.00Z",
    "isImported":false,
    "createdAt":"2016-12-09T12:57:09.708Z",
    "updatedAt":"2016-12-09T12:57:09.709Z",
    "isDeleted":false
    }]}
```
In this example there is a list of payments ("items") associated with a particular tenant contract . Each payment ("item") has a unique id (e.g. "id: 1366"). A payment also has the id of the contract it relates to ("contractId").

The returned "sum" is the total sum of all "item.value"s.

The task is to build a backend API for this data with endpoints to achieve the following:

1. Fetch the list of payments above (which were made in a particular time frame) with the following params:
    - contractId;
    - startDate - the beginning of the payment period we want to consider; and
    - endDate - the end of the payment period we want to consider.
2. Add a new payment to a contract
3. Update an existing payment
4. Delete a payment

You can either build this API as a restful service or using GraphQL.

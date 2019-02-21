# The Solution

I have chosen to implement the API as a nodejs/express/mongodb server launched from a docker-compose script.

The main reason for this choice was simplicity in running the system without extensive AWS knowledge and the ability to extend the system with a contract-model which would be a parent object for payments (not asked for by the challenge, but it is reasonable to implement such a feature later on)

A few other assumptions were made:
* ids of Payment objects are provided by mongoose, whereas contractIds are left as Numbers for now. At a later point, this would be Mongoose objectIds which reference the Contract object.
* routes include a path-parameter contract which is not being evaluated by most routes. This challenge does not implement different contracts, but changing api paths should be avoided after deployment. For consistency, all routes contain this parameter.
* signatures of static-methods in the payment model include a field contractId which is not evaluated. The reason for adding it to the signatures is the later requirement for separation of contracts (using access-rules, etc.) as well as API-consistency
* input validation is implemented only on add/update paths and route-parameters to provide consumers with feedback - other values rely on evaluation by mongoose.

# Run and use

Assuming you have Docker and docker-compose installed, the following command brings up two containers: api (listening on port 3000) and mongo (listening on 127.0.0.1:27017 - accessible from the same machine with db-explorers or the nodejs api running outside of Docker):

```
$ docker-compose up
```

The following routes are available:

* GET /api/contract/:contractId/payment/from/:startDate/to/:endDate - :startDate and :endDate are unix timestamps (milliseconds)
* POST /api/contract/:contractId/payment
* PUT /contract/:contractId/payment/:paymentId
* DELETE /contract/:contractId/payment/:paymentId

There is a postman collection which contains sample-requests for all routes (individual paymentId are set by mongoose and will be different).


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

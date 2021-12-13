# An Api For Bank services (learnable 21)


## How to Use The API;


# USER ROUTES


CREATE User: Restricted to only the admin , Send a post request api to the "/api/users" route. with the following payloads ("fullName", "email","typeOfAccount" [savings or current],"phone","password","passwordConfirm")

GET ALL Users: Restricted to only the admin, Send a get request to the "/api/users" route.

GET ONE BOOK: Restricted to only the admin, send a get request with the user's id as a parameter  to "/api/users/:id" route.

LOGIN : No restriction, send a post request with email and password as payload  to "/api/users/login" route. 

DELETE User: Restricted to only the admin, send a delete request with the user's id as a parameter  to "/api/users/:id" route.

DISABLE USER: Restricted to only the admin, send a patch request with the user's id as a parameter  to "/api/users/:id/disable" route.

ACTIVATE USER: Restricted to only the admin, send a patch request with the user's id as a parameter  to "/api/users/:id/activate" route.

# TRANSACTION ROUTES


DEPOSIT: user must be logged in, Send a post request to the transactions route with the amount to deposit as payload  to the "/api/transactions/deposit" route.

WITHDRAWAL: user must be logged in, Send a post request to the transactions route with the amount to withraw as payload  to the "/api/transactions/withdraw" route.

TRANSFER: user must be logged in, Send a post request to the transactions route with the (amount, receiver: account number, description) to transfer as payload to the "/api/transactions/transfer" route.

REVERSE: Restricted to only the admin, Send a patch request to the transactions route with the transactionID as parameter to the "/api/transactions/reverse/:transactionID" route.


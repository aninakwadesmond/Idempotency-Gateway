Submit your repo link via the [online](https://forms.office.com/e/rGKtfeZCsH) form.

---

## 🛑 Pre-Submission Checklist

**WARNING:** Before you submit your solution, you **MUST** pass every item on this list.
If you miss any of these critical steps, your submission will be **automatically rejected** and you will **NOT** be invited to an interview.

### 1. 📂 Repository & Code

- [ ] **Public Access:** Is your GitHub repository set to **Public**? (We cannot review private repos).
- [ ] **Clean Code:** Did you remove unnecessary files (like `node_modules`, `.env` with real keys, or `.DS_Store`)?
- [ ] **Run Check:** if we clone your repo and run `npm start` (or equivalent), does the server start immediately without crashing?

### 2. 📄 Documentation (Crucial)

- [ ] **Architecture Diagram:** Did you include a visual Diagram (Flowchart or Sequence Diagram) in the README?
- [ ] **README Swap:** Did you **DELETE** the original instructions (the problem brief) from this file and replace it with your own documentation?
- [ ] **API Docs:** Is there a clear list of Endpoints and Example Requests in the README?

### 3. 🧹 Git Hygiene

- [ ] **Commit History:** Does your repo have multiple commits with meaningful messages? (A single "Initial Commit" is a red flag).

---

**Ready?**
If you checked all the boxes above, submit your repository link in the application form. Good luck! 🚀

# Idempotency Gateway - FinSafe Transaction

## Architecture Diagram

## ![FlowChart](./doc//FlowChart.png)

## **Setup Instructions**

1.Clone the repository
git clone https://github.com/aninakwadesmond/Idempotency-Gateway.git

2. Install dependencies
   npm install

3. Create your environment file
   .env
   Then fill in this values:

   -PORT=3001
   -MONGO_URL=mongodb+srv://aninakwahdesmond3_db_user:mista334@cluster0.ypti1pb.mongodb.net/?appName=Cluster0
   -JWT_SECRET_KEY=mista334

4. Start the server
   npm start

## API DOCUMENTATION

### AUHT ENDPOINT / USER AUTHENTICATION

#### POST /user/register

Create a new User account if one account of such email does not exist in the database.
Set JWT token in the cookies and header and will be pass alongside any other request.

Headers:
Content-Type:application/json

Body:

##### {"name":"Dessy", "email":"aninakwa2@gmail.com", "password":"abc455"}

Note : For security reasons, the encrypted password is excluded from the response;

Response 201 (created) :

##### {

    "result": {
    "status": "successfully registered",
    "name": "Dessy",
    "email": "aninakwa10013313311@gmail.com",
    "\_id": "6a23e7437f9209325ba9e6c6"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMjNlNzQzN2Y5MjA5MzI1YmE5ZTZjNiIsImVtYWlsIjoiYW5pbmFrd2ExMDAxMzMxMzMxMUBnbWFpbC5jb20iLCJpYXQiOjE3ODA3Mzc4NTksImV4cCI6MTc4MDkxMDY1OX0.Ors3Nb30XfqkivxbHQ0imDusQyTmHAKvL2FepW7tuUs"

}

#### POST /user/login

Autheticate an existing user and set JWT in cookies and header

Headers:
Content-Type:application/json

set authorization in the header
example:
authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMjMxNzRlYmRjZjEzN2QzOTBlNWEwYiIsImVtYWlsIjoiYW5pbmFrd2EyQGdtYWlsLmNvbSIsImlhdCI6MTc4MDY4NzA2OSwiZXhwIjoxNzgwODU5ODY5fQ.q2-NdArX9Jzw3CODXaSjxzpwyZvGpPJBF1pDohAIseY

Body:

##### { "email":"aninakwa2@gmail.com", "password":"abc455"}

No " authorization "in the header , response will be":

##### {

    "message": "Unauthorized user. Please register for a token"

}

Response (with ** authorization ** set in the header , valid JWT sent upon successful registeration) :

##### {

    "message": "successfully login",
    "existUser": {
    "\_id": "6a23174ebdcf137d390e5a0b",
    "userName": "Dessy",
    "email": "aninakwa2@gmail.com",
    "password": "$2b$10$PAWrpTAdVZm/LpBX9aUj1OPhchlxe/VMhEGKTYjYV0fD4pD4OHSIa",
    "createdAt": "2026-06-05T18:37:02.967Z",
    "updatedAt": "2026-06-05T18:37:02.967Z",
    "\_\_v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMjMxNzRlYmRjZjEzN2QzOTBlNWEwYiIsImVtYWlsIjoiYW5pbmFrd2EyQGdtYWlsLmNvbSIsImlhdCI6MTc4MDczOTA5MiwiZXhwIjoxNzgwOTExODkyfQ.GfnU_E5SClzIwEJa0N7OAdLddrRjEfLQjt-zRgHV8pM"

}

### PAYMENT ENDPOINT && IDEMPOTENCY_MIDDLEWARES

All payment request require authorization: Bearer <token> and idempotency-key in the headers

#### POST /process-payment

Initialize new Payment with protected middlewares thus JWT auth and idempotency middleware

Headers:
authorization:Bearer <token>,
idempotency-key:<unique uuid>,
Content-Type:application/json

example Headers:

\*\* authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMjMxNzRlYmRjZjEzN2QzOTBlNWEwYiIsImVtYWlsIjoiYW5pbmFrd2EyQGdtYWlsLmNvbSIsImlhdCI6MTc4MDY4NzA2OSwiZXhwIjoxNzgwODU5ODY5fQ.q2-NdArX9Jzw3CODXaSjxzpwyZvGpPJBF1pDohAIseY
Body:

idempotency-key: abc123 \*\*

Body:

##### {"amount": 10,"currency":"GH" }

Response 201 (first time request created):

##### {

    "\_id": "6a23f00e0d34b7b6e609f8dc",
    "key": "abc123",
    "bodyHash": "05f28f0929efc09dd3355e05c35b1fd8d0c7ffc5bf4ba1f2ec95b3730c9f72cd",
    "status": "completed",
    "responseBody": {
    "status": "success",
    "message": "Charged 100 GHS",
    "transaction_id": "6a23f00e0d34b7b6e609f8dc",
    "timeStamp": 1780740113130
    },
    "statusCode": 201,
    "user": {
    "\_id": "6a23174ebdcf137d390e5a0b",
    "userName": "Dessy",
    "email": "aninakwa2@gmail.com"
    },
    "createdAt": "2026-06-06T10:01:50.712Z",
    "\_\_v": 0

}

Response 201 (duplicate request , same key, same body)
Exact same response as the first request no new request charge

##### {

    "status": "success",
    "message": "Charged 100 GHS",
    "transaction_id": "6a23f00e0d34b7b6e609f8dc",
    "timeStamp": 1780740113130

}

Response 409 (same key, but different body)
if the body is change from the initial amount to a new value like 20 or 100 or any value
Body:

##### {"amount": 100,"currency":"GH" }

Response output:

#####

{

    "message": "Idempotency key already used for a different request body."

}

Reposnse 400 (!No _idemptency-key_ in the header
)
Body:

##### {"amount": 10,"currency":"GH" }

Response output:

##### {

    "message": "Idempotency key is required in the header"

}

Reposnse 403 (!No _authorization_ set in the header)
Body:

##### {"amount": 10,"currency":"GH" }

Response output:

##### {

    "message": "Unauthorized user. Please register for a token"

}

## DESIGN DOCUMENTATION

### 1. JWT AUHTHENTICATION

Every payment request is protected by a JWT middleware that runs before Idempotency middleware which means:
-only authentictated user can initialize payment
-if token is expires, the request never reach the Idempotency layer at all

### 2. User reference on every Idempotency Record

Every Idempotency record stores user mongoose objectID which means:
-Every transaction is traceable back to the original user that initiate the payment
-you can query all transaction by a specific user
-used for audit trial and fraud detection/investigation in real fraud cases

### 3. SHA-256 Body Hashing for Tamper Detection

Instead of storing the entire reuest in the db we the hashed output from Sha-256 algorithm

-if a user send a request with same idempotency but different amount in the request body we tamper/interfer and return 422 immediately. Flag for fraud

crypto with 'sha-256'algorithm is used instead of brypt.hash() because crypto is more deterministic:
-same input/payload will always hash to the same output
-bcrypt attach and random value for same input make it impossible to compare with bcrypt.compare().Moslty recommended for password hash not a request.body hash

### 4. Poling-based flight lock(Race condition)

when two identical request happens same time the second request polls MongoDB every 200ms(waiting for some few seconds to complete the process)
Avoiding double request which may result in double charging

### 5. Mongo TTL index (24 hours expiry)

The createdAt field on each IdempotencyRecord has a TTL (Time To Live) of 24hrs, so after the TTL the document is automatically delected without any cleanup code needed
-making the same Idempotency-key reusable after 24hrs

## Developer's choice - User scoped Audit trials

_Feautures addedd_:
Every Idempotency Record / document has the user mongoose ObjectId referencing the User who made that request

- why this matter's for a real fintech company
  in production payment system regulators require answers to these questions

-"Who made the transaction"
-"Did this user attempt to make this same payment request twice ? "
-"Show me all the transaction by this user in the last 24hrs"

By linking the Idempotency record with the user's id we fully support audit trial out of the box.
A complaince Officer or Fraud Analyst can query

#### Idempotency.findOne({user:userId})

-and get all the transaction history, cache response and duplicate detection event for such user without touching the payment collection at all

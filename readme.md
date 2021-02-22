# Bus Transit App


Bus Transit is web application which enables the user to experience hassle free, contactless travel during pandemic and is based on pay-only-when-travelled principle. The passenger has the flexibility to be charged for the journey only if one has travelled.


# Features!

  - Contactless transaction 
  - Pay only when travelled
  - Automatic refunds
  
# Installation 
To install dependencies, 

```sh
npm install
```
# Running the application
```sh
node app.js
```
# Generate Tables
Tables have already been created in keyspace:"tables". 
To create new tables, use a different keyspace and update in db_connection.js 
```sh
node generateData.js
```
	
# Workflow
The user has two roles,
Roles: Passenger and Conductor 

Book a ticket (Passenger)
1. Click on Sign Up -> choose Google Auth or Enter the required credentials 
(Be sure to enter the phone number with extension), choose role as passenger
2. Go to  /list  endpoint and tickets are displayed
3. Click on "book" button and then details are shown.
4. Click on "Pay" button  
5. Enter 4242424242424242 in credit card no. field and then enter cvv 122 and month/year
02/2022
6. Phone receives an OTP (blockchain verification code is XXX)

Verify (Conductor)
1. Click on Sign Up -> choose Google Auth or Enter the required credentials 
(Be sure to enter the phone number with extension), choose role as conductor
2. Go to /page endpoint 
3. Enter Phone Number of passenger with extension such as (+91)
4. Enter OTP provided by passenger and from and to fields of bus
5. Click on verify 

Refund(Passenger)
1. Click on SignIn -> Enter credentials
2. Go to "/mytickets" endpoint 
3. Click on refund button

Logout
1. Go to /logout endpoint

Home
1. Click on LOGO to navigate to /home

## Important Endpoints
#### Passenger Endpoints
/list : Renders list of tickets 
/mytickets :Renders list of tickets booked by user


#### Conductor endpoints
/page  : Displays OTP verification form for conductor to fill
# Technology Stack
Datastax Node.js Cassandra driver 

### Dependencies:

|  Dependencies     |   Usage     |
| ------ | ------ |
| ejs | View engine |
| stripe | Handling payments  |
| jwtwebtoken | JWT token generation |
| passport.js | Google authentication |
| twilio | OTP generation |



 












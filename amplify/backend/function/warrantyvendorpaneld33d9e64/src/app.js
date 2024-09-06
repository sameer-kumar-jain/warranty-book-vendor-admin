/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/* Amplify Params - DO NOT EDIT
  ENV
  REGION
Amplify Params - DO NOT EDIT */

const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
const categoriesRoutes = require('./api/routes/categories')
const invoicesRoutes = require('./api/routes/invoices')
const customersRoutes = require('./api/routes/customers')

const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});
/*
FIND COGNITO IDENTITY AND PASS TO OTHER ROUTES
*/
app.use(function (req, res, next) {
  try {
    req.user_id = req.apiGateway.event.requestContext.authorizer.claims["cognito:username"];
    next();
  } catch (err) {
    res.status(400).json({ error: 'Unauthenticated access', err })
  }
});
app.use('/categories', categoriesRoutes)
app.use('/invoices', invoicesRoutes)
app.use('/customers', customersRoutes)
app.listen(3000, function () {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app

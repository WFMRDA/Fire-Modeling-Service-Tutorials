/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var config = require('./config/params') 
var LandscapeService = require('./msf/landscape');
var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var Redis = require('ioredis');
// var redis = new Redis(config.redisConfig);
// var axios = require('axios');
// var qs = require('qs');
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});
 
app.get('/landscape', function(req, res) {
    var id = req.query.id;  
    LandscapeService.auth = {
      username: req.query.username,
      password: req.query.password
    } 
    LandscapeService.status(id)
    .then(function(response){
        // console.log(response.data);
        res.status(response.status).json(response.data);
    })
    .catch(error => {
        var errorMessage = '';
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log('error.response');
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            errorMessage = error.response.data;
            res.status(error.response).json(errorMessage);
        } else if (error.request) {
            console.log('error.request');
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
            errorMessage = error.request;
            res.status(500).json(errorMessage);
        } else {
            console.log('error all');
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
            errorMessage = error.message;
            res.status(500).json(errorMessage);
        } 
    });
});

app.post('/landscape/create', function(req, res) {
 
    LandscapeService.auth = req.query;
    var payload = req.body;  
    LandscapeService.create(payload)
    .then(function(response){
        // console.log(response.data);
        res.status(response.status).json(response.data);
    })
    .catch(error => {
        var errorMessage = '';
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log('error.response');
            console.log('data',error.response.data);
            console.log('status',error.response.status);
            // console.log(error.response.headers);
            errorMessage = error.response.data;
            res.status(error.response.status).json(errorMessage);
        } else if (error.request) {
            console.log('error.request');
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
            errorMessage = error.request;
            res.status(500).json(errorMessage);
        } else {
            console.log('error all');
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
            errorMessage = error.message;
            res.status(500).json(errorMessage);
        } 
    });
    // .then(function (response) {
    //     // handle success
    //     res.json(response)
    // })
    // .catch(function (error) {
    //     // handle error
    //     console.log(error);
    // })
    // .then(function () {
        
    // });
    // .then(function(response){
    //     console.log(response.data);
    //     res.json({success:'Succeed',response:response.data})
    // })
    // .catch(error => {
    //     var errorMessage = '';
    //     if (error.response) {
    //         // The request was made and the server responded with a status code
    //         // that falls out of the range of 2xx
    //         console.log(error.response.data);
    //         console.log(error.response.status);
    //         console.log(error.response.headers);
    //         errorMessage = error.response.data;
    //     } else if (error.request) {
    //         // The request was made but no response was received
    //         // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    //         // http.ClientRequest in node.js
    //         console.log(error.request);
    //         errorMessage = error.request;
    //     } else {
    //         // Something happened in setting up the request that triggered an Error
    //         console.log('Error', error.message);
    //         errorMessage = error.message;
    //     }
    //     res.json({success:'Failed',response:errorMessage})
    // });
});
 
app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app

/* eslint-disable no-console */
var config = require('../config/params');
const AWS = require('aws-sdk');
class BaseModel {

    getAWSClient(){
        return new AWS.S3({
            apiVersion: '2006-03-01',
            accessKeyId: config.AWS_ACCESS_KEY,
            secretAccessKey: config.AWS_SECRET_ACCESS_KEY
        });
    
    }
    getErrorMessage(error){ 
        let status; 
        var data;
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log('error.response');
            console.log('data',error.response.data);
            console.log('status',error.response.status);
            // console.log(error.response.headers); 
            status = error.response.status;
            data = error.response.data; 


        } else if (error.request) {
            console.log('error.request');
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request); 
            status = 500;
            data = error.request;   
            console.log('data',data);
            console.log('status',status); 
        } else {
            console.log('error all');
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);  
            status = 500;
            data = { responseMessage: error.message };   
        } 

        return {
            status: status,
            data: data
        }
    }

}

module.exports =  BaseModel;
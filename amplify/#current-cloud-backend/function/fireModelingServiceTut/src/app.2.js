/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
 
const LandscapeService = require('./msf/landscape');
const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')


const AWS = require('aws-sdk');
var config = require('./config/params');
const fs = require('fs');
var axios = require('axios');

// var redis = new Redis(config.redisConfig);

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});
 
// Create Landscape

app.post('/landscape/create', async function(req, res) { 
    console.log(req.body,req.query);
    // res.json({success: 'put call succeed!', url: req.url, body: req.body,query:req.query})
    let model = new LandscapeService({
        username: req.query.username,
        password: req.query.password
    }); 
    let response = await model.createLandscape(req.body);
    res.status(response.status).json(response.data);
});

//Get Lanscape Status
app.get('/landscape', async function(req, res) { 
    let model = new LandscapeService({
        username: req.query.username,
        password: req.query.password
    });
    let response = await model.getStatus(req.query.id);
    // console.log('response' ,response);
    res.status(response.status).json(response.data);
});

app.get('/landscape/download', async function(req, res) { 
    let model = new LandscapeService({
        username: req.query.username,
        password: req.query.password
    });
    model.moveLandscapeToAWS(req.query.id);
    let entityId = req.query.id;
});

app.get('/landscape/download-TEMPLATE', async function(req, res) {  
    let model = new LandscapeService({
        username: req.query.username,
        password: req.query.password
    });
    let entityId = req.query.id;
    let timestamp = new Date().toISOString();
    
    var s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        accessKeyId: config.AWS_ACCESS_KEY,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY
    });

    var url = 'https://wfdss.usgs.gov/WfdssWeb/service/ii/listfull?user=rgoolsby_wws&controlled=false&out=false&dashboard=true';
    
    // var url ='http://bit.ly/2mTM3nY';
    // var url = 'http://www.africau.edu/images/default/sample.pdf';
 
    // GET request for remote image
    axios({
        method:'get',
        url:url,
        responseType:'stream'
    })
    .then(function (response) {
        // res.json({response: response.data})
        // response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
        const params = {
            Bucket: 'serverless-storage-wfmrda-modeling-service', // pass your bucket name
            Key: 'wfdss.zip', // file will be saved as testBucket/contacts.csv 
            Body: response.data,
            ContentType : 'application/x-zip', //<-- this is what you need!
            ContentDisposition : 'attachment; filename=wfdss.zip', //<-- and this !
            ACL         : 'public-read',//<-- this makes it public so people can see it
            Metadata:{
                uploadTime: timestamp
            }
        };

        s3.upload(params, function(s3Err, data) {
            if (s3Err) throw s3Err
            console.log(`File uploaded successfully at ${data.Location}`);
            
            // res.json({success: `File uploaded successfully at ${data.Location}`,data:data})
        });
        var params = {
            Bucket: "serverless-storage-wfmrda-modeling-service", 
            Key: "wfdss.zip"
        };
        s3.getObject(params, function(err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
            }else{
                console.log('get object',data);           // successful response
            }
            
            res.json({success: data})
        });

    }); 
});


app.get('/landscape/test', async function(req, res) { 
    //https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types
    // res.header("Content-Type", "application/zip");
    // res.header("Content-Type", "application/x-zip");
    // res.header("Content-Type", "application/octet-stream");
    // res.header("Content-Disposition", 'attachment; filename="wfdss.zip"');

    res.header("Content-Type", "application/zip");
    res.header("Content-Disposition", 'inline; filename=filename.jpg');
    var url = 'http://bit.ly/2mTM3nY';

    axios({
        method:'get',
        url:url,
        responseType:'stream'
    })
    .then(function (response) { 
        response.data.pipe(res);
    });


    // axios .get(url, {
    //   responseType: 'arraybuffer'
    // }) 
    // .then(function (response) { 
    //     // var data = response.data;
    //     // new Buffer(response.data, 'binary').toString('base64');
    //     var img = Buffer.from(response.data, 'binary').toString('base64');
    //     res.writeHead(200, {
    //         'Content-Type': 'image/png',
    //         'Content-Length': img.length,
    //       });
    //     res.end(img); 
    // });

    // axios.get(url, { responseType: 'arraybuffer' }).then(function(response) {
    //     // var img1 = `data:${response.headers['content-type']};base64,${btoa(String.fromCharCode(...new Uint8Array(response.data)))}`;
    //     var img2 =`data:${response.headers['content-type']};base64,${Buffer.from(String.fromCharCode(...new Uint8Array(response.data)), 'binary').toString('base64')}`;

    //     res.writeHead(200, {
    //         'Content-Type': 'image/png',
    //         'Content-Length': img2.length,
    //     });
    //     res.end(img2); 
    // })
    

});

app.get('/landscape/download-old', async function(req, res) { 
    //https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types
    // res.header("Content-Type", "application/zip");
    // res.header("Content-Type", "application/x-zip");
    // res.header("Content-Type", "application/octet-stream");
    // res.header("Content-Disposition", 'attachment; filename="wfdss.zip"');
    let model = new LandscapeService({
        username: req.query.username,
        password: req.query.password
    });

    
    var s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        accessKeyId: config.AWS_ACCESS_KEY,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY
    });

    var url = 'https://wfdss.usgs.gov/WfdssWeb/service/ii/listfull?user=rgoolsby_wws&controlled=false&out=false&dashboard=true';
    
    // var url ='http://bit.ly/2mTM3nY';
    // var url = 'http://www.africau.edu/images/default/sample.pdf';
  // GET request for remote image
   /*  axios({
        method:'get',
        url:url,
        responseType:'stream'
    })
    .then(function (response) { 
        response.data.pipe(res)
    }); */
  
    // GET request for remote image
    /*axios({
        method:'get',
        url:url,
        responseType:'stream'
    })
    .then(function (response) {
        // res.json({response: response.data})
        // response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
        const params = {
            Bucket: 'serverless-storage-wfmrda-modeling-service', // pass your bucket name
            Key: 'wfdss.zip', // file will be saved as testBucket/contacts.csv 
            Body: response.data,
            // ContentType : 'image/jpeg', //<-- this is what you need!
            // ContentDisposition : 'inline; filename=filename.jpg', //<-- and this !
            // ACL         : 'public-read'//<-- this makes it public so people can see it
        };
        s3.upload(params, function(s3Err, data) {
            if (s3Err) throw s3Err
            console.log(`File uploaded successfully at ${data.Location}`)

            res.json({success: `File uploaded successfully at ${data.Location}`,data:data})
        });
    }); */   


/*     const fileName = '/Users/digitaljungle/Sites/sites/Fire-Modeling-Service-Tutorials/amplify/backend/function/fireModelingServiceTut/src/test.txt';
    fs.readFile(fileName, (err, data) => {
        if (err) throw err;
        const params = {
            Bucket: 'serverless-storage-wfmrda-modeling-service', // pass your bucket name
            Key: 'test.txt', // file will be saved as testBucket/contacts.csv
            Body: data
        };
        s3.upload(params, function(s3Err, data) {
            if (s3Err) throw s3Err
            console.log(`File uploaded successfully at ${data.Location}`)

            res.json({success: `File uploaded successfully at ${data.Location}`,data:data})
        });
    }); */
});



 
app.listen(3000, function() {
    console.log("App started")
});

module.exports = app

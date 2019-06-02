'use strict' 
/* eslint-disable no-console */ 
var axios = require('axios');
var config = require('../config/params') 
var BaseModel = require('./baseModel')
var querystring = require('querystring');
var empty = require('locutus/php/var/empty');
// var config = require('../config/params');
// var Redis = require('ioredis');
 
class LandscapeService  extends BaseModel{

    constructor(auth){
        super();
        this.auth = auth;
    }

    async createLandscape(payload){
        console.log(`Creating Landscape  with ${payload}`); 
        let response ;
        try {
            response = await axios({ 
                baseURL: config.serviceUrl,
                auth:this.auth,
                method: 'POST',
                url: '/create',  
                data: querystring.stringify(payload),
                config: { 
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded", 
                        "cache-control": "no-cache",
                    }
                }
            });
        } catch (e) {  
            response = this.getErrorMessage(e);
        }
        return response;
    }

    
    async getStatus(runId){
        console.log(`Getting Landscape ${runId} Status`); 
        let response ;
        try {
            // response = await this._getStatus(runId);  
            response = await axios({ 
                baseURL: config.serviceUrl,
                auth:this.auth,
                method: 'GET',
                url: '/status/'+runId,  
                config: { 
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded", 
                        "cache-control": "no-cache",
                    }
                }
            })
            // console.log('status done'); 
            // console.log( 'status',response.status)
            // console.log( 'data',response.data)
        } catch (e) {  
            response = this.getErrorMessage(e);
        }
        return response;
    }
    
    async downloadLandscapeFile(entityId){

        console.log(`Downloading Landscape ${entityId}`); 
        let response ;
        try {  
             response = await axios({ 
                baseURL: config.serviceUrl,
                auth:this.auth,
                method: 'GET',
                url:`/lcp/${entityId}`,  
                responseType:'stream',
                config: { 
                    headers: { 
                        "Accept": "application/zip"
                    }
                }
            })
        } catch (e) {  
            response = this.getErrorMessage(e);
        }
        return response;
    }

    async moveLandscapeToAWS(query,fileStream){
        if(empty(query.id) || empty(query.type)){
            return false;
        }
        let entityId = query.id;
        let type = query.type;
        console.log(`Moving Landscape ${entityId} To S3`); 
        let response ;
        var s3 = this.getAWSClient();
        var timestamp = new Date().toISOString();
        try {
            const params = {
                Bucket: config.AWS_S3_BUCKET, // pass your bucket name
                Key: `landscape/${type}/${entityId}.zip`, // file will be saved as testBucket/contacts.csv 
                Body: fileStream,
                ContentType : 'application/zip', //<-- this is what you need!
                ContentDisposition : `attachment; filename="${entityId}.zip"`, //<-- and this !
                ACL         : 'public-read',//<-- this makes it public so people can see it
                Metadata:{
                    uploadTime: timestamp
                }
            };
            response = s3.upload(params).promise();
        } catch (e) {  
            response = this.getErrorMessage(e);
        }
        return response;
        
        
    }

}

module.exports =  LandscapeService;

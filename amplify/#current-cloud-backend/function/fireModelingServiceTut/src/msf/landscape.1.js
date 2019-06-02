/* eslint-disable no-console */ 
var axios = require('axios');
var qs = require('qs');
 
var LandscapeService =  {
    serviceUrl: 'http://192.255.42.9/landscapeREST/landscape',
    params: { 
        westLongitude: undefined,
        eastLongitude: undefined,
        northLatitude: undefined,
        southLatitude: undefined,
        landfireYear: 2014,
        resolution: 30,
        fuelModelType: 40,
        editRules: "JSON",
        generateGeotiff: false
    },  
    auth:{
        username:'',
        password:'',
    },
    create : function(payload){ 
        this.params = Object.assign(this.params,payload); 
        var data = {
            "West Longitude":this.params.westLongitude,
            "East Longitude":this.params.eastLongitude,
            "North Latitude":this.params.northLatitude,
            "South Latitude":this.params.southLatitude,
            "Landfire Year":this.params.landfireYear,
            "Resolution":this.params.resolution,
            "Fuel Model Type":this.params.fuelModelType,
            "Edit Rules":this.params.editRules,
            "Generate Geotiff":this.params.generateGeotiff
        }
        return axios({  
            baseURL: this.serviceUrl,
            auth:{
                username:  this.auth.username,
                password:  this.auth.password
            },
            method: 'POST',
            url: 'create', 
            data: qs.stringify(data),
            config: { 
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded", 
                    "cache-control": "no-cache",
                }
            }
        });
    },
    status: function(id){ 
        return axios({ 
            auth:{
                username:  this.auth.username,
                password:  this.auth.password
            },
            method: 'GET',
            url: this.serviceUrl + '/status/'+id,  
            config: { 
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded", 
                    "cache-control": "no-cache",
                }
            }
        });
    }
}

module.exports =  LandscapeService;

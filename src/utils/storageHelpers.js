/* eslint-disable no-console */

//import { getValue } from './helpers.js'
import empty from 'locutus/php/var/empty';

export {landscapeStorage};


var landscapeStorage = { 

    saveLandscapeCreate(response){ 
        var landscapeDb =  (empty(localStorage.getItem('landscapeDb')))? {} : JSON.parse(localStorage.getItem('landscapeDb'));
        landscapeDb[response.entityId] = {};
        landscapeDb[response.entityId] = response; 
        localStorage.setItem('landscapeDb',JSON.stringify(landscapeDb));  
        landscapeDb =  (empty(localStorage.getItem('landscapeDb')))? {} : JSON.parse(localStorage.getItem('landscapeDb'));
        return landscapeDb.hasOwnProperty(response.entityId);
    },
    getLandscapes(){
        return (empty(localStorage.getItem('landscapeDb')))? {} : JSON.parse(localStorage.getItem('landscapeDb'));
    },
    updateLandscape(response){
        var landscapeDb =  (empty(localStorage.getItem('landscapeDb')))? {} : JSON.parse(localStorage.getItem('landscapeDb'));
        var model = Object.assign(landscapeDb[response.landscapeId],{
            status: response.status,
            expiration: response.expiration
        }); 
        landscapeDb[response.landscapeId] = model;

        localStorage.setItem('landscapeDb',JSON.stringify(landscapeDb));  
        landscapeDb =  (empty(localStorage.getItem('landscapeDb')))? {} : JSON.parse(localStorage.getItem('landscapeDb'));
        return landscapeDb.hasOwnProperty(response.landscapeId); 
    },
    delete(id){
        var landscapeDb =  (empty(localStorage.getItem('landscapeDb')))? {} : JSON.parse(localStorage.getItem('landscapeDb'));
        delete landscapeDb[id];
        localStorage.setItem('landscapeDb',JSON.stringify(landscapeDb)); 
    }
}
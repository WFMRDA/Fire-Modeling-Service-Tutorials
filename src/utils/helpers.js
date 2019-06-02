/* eslint-disable no-redeclare */
import strrpos from 'locutus/php/strings/strrpos'


export {clone, getValue,validateGPS,removeDuplicates,isString,isArray,isObject,formatSearch,humanTiming,precisionRound,splitOnCapitolLetter,capitalizeFirstLetter,buildUrl};

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
function getValue(array, key, dVal) {
    if(array == undefined){
        var defaultValue = (dVal == undefined) ? null : dVal;
        return defaultValue;
    }
    if (isArray(key)) {
        var lastKey = key.pop();
        var keyLength = key.length;
        for (var i = 0; i < keyLength; i++) {
            var keyPart = key[i];
            var array = getValue(array, keyPart);
        }
        var key = lastKey;
    }
    var defaultValue = (dVal == undefined) ? null : dVal;
    var pos = strrpos(key, '.');
    if (pos !== false) {
        var newKey = key.substr(0, pos);
        array = getValue(array, newKey, defaultValue);
        var key = key.substr(pos + 1);
    }
    let notString = (isArray(array) || isObject(array));
    let isSet = (array !== null && array !== undefined && !array[key] !== undefined && array[key] !== null);

    return  (notString && isSet) ? array[key] : defaultValue;

}

function validateGPS(val) {
    return /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)[, ]\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/.test(val);
}

function removeDuplicates(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for (var i = 0; i < len; i++) {
        var item = a[i];
        if (seen[item] !== 1) {
            seen[item] = 1;
            out[j++] = item;
        }
    }
    return out;
}

function isString(arg) {
    return Object.prototype.toString.call(arg) === '[object String]';
}

function isArray(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
}

function isObject(arg) {
    return Object.prototype.toString.call(arg) === '[object Object]';
}

function formatSearch(string){
    return string.split(',')[0];
}

function humanTiming(time) {
    // time = 1535732553;
    let now = Math.floor(new Date().getTime() / 1000);
    let timeSince = now - time;
    // console.log(now);
    // console.log(timeSince);
    //     31536000 => 'year',
    //     2592000 => 'month',
    //     604800 => 'week',
    //     86400 => 'day',
    //     3600 => 'hour',
    //     60 => 'minute',
    //     1 => 'second'
    let Units = [
        '31536000',
        '2592000',
        '604800',
        '86400',
        '3600',
        '60',
        '1',
    ];
    let Desc = [
        'year',
        'month',
        'week',
        'day',
        'hour',
        'minute',
        'second',
    ];
    
    for (let i = 0; i < 7; i++) {
        let unit = parseInt(Units[i]);
        if (timeSince < unit) {
            continue;
        }
        let text = Desc[i];
        // console.log('unit => ' + unit);
        // console.log('text => ' + text);
        // console.log('Comparison => ' + timeSince + ' < ' + unit);
        // console.log('Comparison => Passed ' + timeSince + ' < ' + unit);

        let numberOfUnits = Math.floor(timeSince / unit);
        return numberOfUnits + ' ' + text + ((numberOfUnits > 1) ? 's ago' : ' ago');
    }
    return '0 second\'s ago';
}

function precisionRound(number, precision) {
    if(precision == undefined){
        precision = 2;
    }
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

function splitOnCapitolLetter(string){
    if(string == undefined || string == null){
        return '';
    }
    return string.split(/(?=[A-Z])/).join(" ");
}

function capitalizeFirstLetter(string) {
    if(string == undefined || string == null){
        return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function buildUrl(url, parameters) {
    let qs = "";
    for (const key in parameters) {
        if (parameters.hasOwnProperty(key)) {
            const value = parameters[key];
            qs +=
                encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
        }
    }
    if (qs.length > 0) {
        qs = qs.substring(0, qs.length - 1); //chop off last "&"
        url = url + "?" + qs;
    }

    return url;
}



/**
 * query city name form ip
 */
function getCityName(cb) {
    //http://www.geoplugin.net/json.gp?jsoncallback=
   const url = 'http://www.geoplugin.net/json.gp';
    jsonp(url, 'jsoncallback', (json) => {
        cb(json.geoplugin_city, json.geoplugin_countryName);
    });
}

function jsonp(url, cbName, cb) {
    let httpUrl,
        callbackName = cbName,
        cbFunction = cb,
        tempfunc;
    if(arguments.length === 2) {
        callbackName = 'callback';
        cbFunction = cbName;
    }

    if(url.indexOf('?') !== -1) {
        httpUrl = `${url}&`;
    } else {
        httpUrl = `${url}?`;
    }
    httpUrl += callbackName + '=tempfunc';
    tempfunc = function (json) {
        cbFunction(json);
    }
    //create globle proporty
    window['tempfunc'] = tempfunc;
    //create script element
    const srp = document.createElement('script');
    srp.src = httpUrl;
    //add script element to <head>
    document.head.appendChild(srp);
}
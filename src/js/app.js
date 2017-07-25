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

/**
 * query weather data according to city name 
 * 
 */
function getWeatherDataEN(city, cb, lang) {
    let url = 'https://openweathermap.org/data/2.5/find?appid=b1b15e88fa797225412429c1c50c122a1';
    url = `${url}&q=${city}`;
    if(lang) url = `${url}&lang=${lang}`;
    jsonp(url, 'callback', (json) => {
        cb(json);
    });
}
function getLocalStorage() {
    //TODO:get data from local storage
    return {
        tempUnit: 'C',
        lang: 'en'
     };
}
function getWeatherDataCN() {
    //TODO:get chinese data from another api
}
function updateWeather(data) {
    //TODO:calculate temperature;
    let iconEle = document.getElementsByClassName('weather-icon');
    iconEle.src = `"http://openweathermap.org/img/w/"${data.icon}.png`;
    console.log(data);
    jsonToDOM({
        "location": data.city,
        "temp": data.temp - 273.15,
        "weather-description": data.description,
        "temp-min": data.temp_min - 273.15,
        "temp-max": data.temp_max - 273.15,
        "weather-wind": data.wind,
        "weather-humidity": data.humidity
    });
}
function calcuTemperature(temp,unit) {
    //TODO:kelvin temp to C/F
}
function jsonToDOM(obj) {
    for (let key in obj) {
        let ele=document.getElementsByClassName(key)[0];
        ele.innerHTML = obj[key];
    }
}

window.addEventListener('load', (e) => {
    let localData = getLocalStorage();
    let getWeatherData = getWeatherDataEN;
    if(localData.lang === 'zh_cn') getWeatherData = getWeatherDataCN;
    getCityName((name) => {
        getWeatherData(name, (data) => {
            let code = data.code;
            let item = data.list[0];
            let dt = {
                city: item.name,
                temp: item.main.temp,
                temp_min: item.main.temp_min,
                temp_max: item.main.temp_max,
                humidity: item.main.humidity,
                wind: item.wind.speed,
                description: item.weather[0].description,
                icon: item.weather[0].icon
            };
            updateWeather(dt);
        });
    });
});
const request = require('request');
require('dotenv').config();

const openWeatherMap = {
    BASE_URL: "http://api.openweathermap.org/data/2.5/weather?q=",
    SECRET_KEY: process.env.SECRET_KEY
}

const weatherData = (address, callback) => {
    const url = openWeatherMap.BASE_URL + encodeURIComponent(address) + "&APPID=" + openWeatherMap.SECRET_KEY;

    request({ url, json: true }, (error, data) => {
        if (error) {
            callback(true, "Unable to fetch data, please try again" + error)
        }
        callback(false, data?.body);
    });
};

module.exports = weatherData;

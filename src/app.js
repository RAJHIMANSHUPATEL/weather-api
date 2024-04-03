const express = require('express');
const hbs = require('hbs');
const path = require('path');
const weatherData = require('../utils/weatherData');

//Creating the app
const app = express();
const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//Setting up the view engine
app.set('view engine', 'hbs');
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.static(publicPath));

//Home route
app.get('/', (req,res) => {
    res.render('index', {title: "Weather App"})
})

//Getting weather of a particular location
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send("Address is required")
    }
    weatherData(req.query.address, (error, result) => {
        if (error) {
            return res.send(error);
        }
        res.send(result);
    });
})

// Incorrect route
app.get("*", (req, res) => {
    res.render('404', {title: "Page Not Found"})
})

// Linstening to the server
app.listen(port, () => {
    console.log(`Server is running in port ${port}`)
} )
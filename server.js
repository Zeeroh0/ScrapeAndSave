const express = require('express'),
    bodyParser = require('body-parser'),
    mongojs = require('mongojs'),
    mongoose = require('mongoose'),
    request = require('request'),
    cheerio = require('cheerio'),
    exphbs = require('express-handlebars');

const app = express(),
    router = express.Router();

const PORT = process.env.PORT || 8080;

// Keep Heroku live
setInterval(() => {
  request('https://morning-meadow-19271.herokuapp.com/', (err, res, html) => {});
  }, 1800000);

// Set up Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

const databaseURL = "scrapeandsave",
    collections = ["headlines"];

// Set up for Mongoose
const db = process.env.MONGODB_URI || 'mongodb://localhost/scrapeandsave'
mongoose.connect(db, (error) => {
    (error) ? 
        console.log(`Database Error: ${error}`) : 
        console.log(`mongoose connected to database successfully!`);
});

app.use(router);

require("./config/routes.js")(router);

app.listen(PORT, () => {
    console.log("Listening on port:", PORT);
});


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

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

const databaseURL = "scrapeandsave",
    collections = ["headlines"];

// Old way to connect to a local MongoDB
// const db = mongojs(databaseURL, collections);
// db.on("error", (error) => {
//     console.log(`Database Error: ${error}`);
// });

// Set up for Mongoose
const db = process.env.MONGODB_URI || 'mongodb://localhost/scrapeandsave'
mongoose.connect(db, (error) => {
    (error) ? 
        console.log(`Database Error: ${error}`) : 
        console.log(`mongoose connected to database successfully!`);
});

app.use(router);

require("./config/routes.js")(router);

// app.get("/", (req, res) => {
//     res.send("Welcome to the scrape and save site!");
// });

app.listen(PORT, () => {
    console.log("Listening on port:", PORT);
});


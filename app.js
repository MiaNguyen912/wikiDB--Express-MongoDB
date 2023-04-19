const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

//middleware
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public")); //use "public" directory to store static files

//mongoose
mongoose.connect("mongodb://localhost:27027/wikiDB") //connect to local database 'wikiDB'
const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema); //create 'articles' collection following the articleSchema 


//APIs


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
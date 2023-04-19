const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();

app.set('view engine', 'ejs');

//middleware
app.use(express.static("public")); //use "public" directory to store static files
app.use(morgan("dev")); //console.log the called api in "dev" format
app.use(express.json()); //parses incoming JSON requests and puts the parsed data in req.body.
app.use(bodyParser.urlencoded({ extended: true})); //parses each element of the body of user's request

//mongoose
mongoose.connect("mongodb://localhost:27017/wikiDB") //connect to local database 'wikiDB'
const articleSchema = {
    title: String,
    content: String
}
const Article = mongoose.model("Article", articleSchema); //create 'articles' collection following the articleSchema 

//APIs
app.route("/articles")
    //get all articles
    .get(async (req,res) => {
        // Article.find().then((articles)=>{console.log(articles);})
        //this is same as: 
    
        const allArticles = await Article.find(); //return all articles 
        // console.log(allArticles);
        allArticles && res.send(allArticles); //respond if allArticles exist 
    })

    //post an article
    .post(async(req,res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })
        const result = await newArticle.save();
        if (result) res.send("Successfully added new article")
        else res.send(result);
    
    })

    //delete all articles
    .delete( async(req, res) => {
        const result = await Article.deleteMany();
        if (result) res.send("Successfully delete all articles")
        else res.send(result);
    });

app.route("/articles/:title")
    //get an article
    .get( async(req, res) => {
        const result = await Article.findOne({title: req.params.title});
        if (result) res.send(result);
        else res.send("No articles matching that title was found.");
    })

    //update an article
    .put( async(req,res) => {
        const result = await Article.updateOne(
            {title: req.params.title}, //condition
            {title: req.body.title,  //the update version
             content: req.body.content}
            )
        if (result) res.send("Successfully updated article")
        else res.send(result)
    })
    .patch( async(req, res) => {
        const result = await Article.updateOne(
            {title: req.params.title},
            {$set: req.body} //only set the given title/content, and leave the other field unchanged
        )
        if (result) res.send("Successfully updated article")
        else res.send(result)
    })

    //delete an article
    .delete( async(req, res) => {
        const result = await Article.deleteOne({title: req.params.title})
        if (result) res.send("Successfully deleted the article")
        else res.send(result);
    })


//-------------------

//connect to local port
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
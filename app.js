//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");
const homeStartingContent = "Welcome to my blog! My name is Aravind, and I'm a MERN stack developer with a passion for creating innovative and user-friendly web applications. Through this website, I'll be sharing my insights and experiences on a variety of topics related to web development, including best practices, tips and tricks, and emerging trends. Whether you're just getting started in the world of web development or you're a seasoned pro, I hope you'll find my blog both informative and engaging. So, sit back, grab a cup of coffee, and let's explore the exciting world of MERN stack development together!";
const aboutContent = "At our blog, we are passionate about web development and helping others succeed in this exciting field. Our team is led by Aravind, a skilled MERN stack developer with years of experience creating high-quality web applications. Through our blog, we aim to provide valuable insights and tips to web developers of all levels, from beginners just starting out to experienced professionals looking to stay up-to-date with the latest industry trends. We believe that sharing knowledge and collaborating with others is the key to success in web development, and we are committed to fostering a community of like-minded individuals who are passionate about creating innovative, user-friendly web applications. Thank you for visiting our website, and we look forward to connecting with you!";

const app = express();
mongoose.set('strictQuery',true);
mongoose.connect("mongodb+srv://aravindben562:xsarO0ggCn1QAHn1@blogcluster.7alidy4.mongodb.net/blogDB");
const composeSchema = new mongoose.Schema({
  title:String,
  post:String
});

const composedPost = mongoose.model("content",composeSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  composedPost.find({},function(err,docs){
    if(err){
      console.log(err);
    }
    else{
      res.render("home.ejs",{startContent:homeStartingContent,postList:docs});
    }
  });

});

app.get("/about",function(req,res){
  res.render("about.ejs",{aboutStart:aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact.ejs");
});

app.get("/compose",function(req,res){
  res.render("compose.ejs");
});

app.get("/posts/:topic",function(req,res){
  let topic=_.lowerCase(req.params.topic);
  composedPost.find({},function(err,docs){
    if(err){
      console.log(err);
    }
    else{

    docs.forEach(function(doc){
        if(_.lowerCase(doc.title)===topic){
            res.render("post",{title:doc.title,content:doc.post});
        }
              console.log(doc.post);
      });
    }
  });
});

app.post("/compose",function(req,res){
  const newPost = new composedPost({
    title : req.body.title,
    post : req.body.post
  });
newPost.save();
res.redirect("/");
});



app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});

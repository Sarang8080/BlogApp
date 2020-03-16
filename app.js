var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var mongoose = require("mongoose");
var methodOverride = require("method-override");
mongoose.connect("mongodb://localhost/RestApp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));

app.use(methodOverride("_method"));
//Model Config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date, default:Date.now} //to get the date on which user created post
}) 

var Blog = mongoose.model("Blog",blogSchema);

//RESTFUL ROUTES

/*Blog.create({
    title: "First Blog",
    image : "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    body :"This is my first blog"
}); */

app.get("/",function(req,res){
    res.redirect("/blogs");
})
//Index Route
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("OOPSS");
            console.log("err");
        }
        else{
            res.render("index",{blogs:blogs});
        }
    })
    
})

//NEW ROUTE

app.get("/blogs/new",function(req,res){
    res.render("new");
})

//CREATE ROUTE
app.post("/blogs",function(req,res){
    Blog.create(req.body.blog,function(err,blog){
        if(err){
            console.log('OOPSS');
            console.log("err");
        }
        else{
            res.redirect("/blogs");
        }
    })
    
})



//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show",{blog:foundBlog});
        }
    })
})

//EDIT ROUTE

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{blog:foundBlog});
        }
    })
})

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/" + req.params.id);
        }
    })
})

//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
  if(err){
      res.redirect("/blogs")
  }
  else{
      res.redirect("/blogs");
  }
    })
})




app.listen(3000,function(){
    console.log("Rest App Server");
})
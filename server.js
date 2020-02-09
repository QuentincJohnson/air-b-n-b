const express = require("express");//uses express
const exphbs  = require('express-handlebars');// uses express handlebars
const bodyParser = require('body-parser');// uses body parser

const app = express();

app.engine('handlebars', exphbs());//awknowladges express handlebars
app.set('view engine', 'handlebars'); 

app.use(bodyParser.urlencoded({ extended: false }))//awknowladges body parser

app.use(express.static("public")) //sets public as a static folder


//server port
const PORT = 3000;
app.listen(PORT,() =>{

    console.log('server running')

});

app.get("/", (req,res)=>{
    res.render("home", {
        title: "Air BnB home"
    });
});

app.get("/registration", (req,res)=>{
    res.render("reg", {
        title: "Air BnB registration"
    });
});

app.get("/listing", (req,res)=>{
    res.render("listing", {
        title: "Air BnB Listing"
    });
});

app.get("/login", (req,res)=>{
    res.render("login", {
        title: "Air BnB Login"
    });
});
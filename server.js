const express = require("express");//uses express
const exphbs  = require('express-handlebars');// uses express handlebars
const bodyParser = require('body-parser');// uses body parser
const mongoose = require('mongoose'); // uses mongoose
const fileUpload = require("express-fileupload")
const session = require("express-session")


require('dotenv').config({path:"./config/keys.env"})//environmetntal variable req dosent need a constant

const app = express();

app.engine("handlebars",exphbs(
    {
        helpers:{
            if_eq :function (a,b, opts) {
                if(a == b){
                    console.log("bruh")
                    return opts.fn(this);
                }
                else{
                    console.log('f')
                    return opts.inverse(this);
                }
                
            }
        }
    }
));
app.set('view engine', 'handlebars'); 

app.use(bodyParser.urlencoded({ extended: false }))//awknowladges body parser

app.use(express.static("public")) //sets public as a static folder

app.use((req,res,next)=>{// when righting middlewere it like a route, but we need to add nexr so it moves on the the next middle were/ routes
    if(req.query.method=="PUT") // this test to see if theres a querystring with the name method. then tests what string comes after (in this case PUT)to handle cases of other string wurys
    {
       req.method="PUT"// this method refers to the HTTP request(GET,POST,etc) and is diffrent from above 
//this cahnges the http method to a put 
    }
    //this handles the if method variable = delete
    else if(req.query.method=="DELETE")
    {
        req.method="DELETE"
    }
    //you must call next() to move on to your routes
    next();

});

app.use(fileUpload());//lets you upload files



//configures session
app.use(session({
    secret: process.env.SECRET,//think of this as a salt \dont expose your secrete key and dont use keybarared cat
    resave: false,
    saveUninitialized: true,
}));
//sets session info to a global variable so we can acsess it in templating files
app.use((req,res,next)=>{

    res.locals.user= req.session.userInfo;

    next();
})

//connecting mongoose
mongoose.connect(process.env.MONGO_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true})
.then( function() {
    console.log('all good')
})
.catch( function(err) {
    console.log(`problem town ${err}`)
})

//server port //enviernment variables lets a port be injected my heroku
const PORT = process.env.PORT;
app.listen(PORT,() =>{

    console.log('server running')

});

const genController = require("./controllers/general")
const regController = require("./controllers/registration")
const listController = require ("./controllers/listings")

app.use("/",genController);
app.use("/registration",regController);
app.use("/listing",listController);
const express = require("express");//uses express
const exphbs  = require('express-handlebars');// uses express handlebars
const bodyParser = require('body-parser');// uses body parser


const app = express();

app.engine('handlebars', exphbs());//awknowladges express handlebars
app.set('view engine', 'handlebars'); 

app.use(bodyParser.urlencoded({ extended: false }))//awknowladges body parser

app.use(express.static("public")) //sets public as a static folder


//server port //enviernment variables lets a port be injected my heroku
const PORT = process.env.PORT || 3000;
app.listen(PORT,() =>{

    console.log('server running')

});

const genController = require("./controllers/general")
const regController = require("./controllers/registration")
const listController = require ("./controllers/listings")

app.use("/",genController);
app.use("/registration",regController);
app.use("/listing",listController);
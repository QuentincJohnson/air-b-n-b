const express = require("express");//uses express
const exphbs  = require('express-handlebars');// uses express handlebars
const bodyParser = require('body-parser');// uses body parser

const listMod = require('./models/listings-list') //not a thiird party packge and gets special treatment add ./

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

app.get("/", (req,res)=>{
    const ftl = []
    ftl.push(listMod.places[0]);
    ftl.push(listMod.places[1])
    ftl.push(listMod.places[2])

    res.render("home", {
        title: "Air BnB home",
        places: ftl
    });
});

app.get("/registration", (req,res)=>{
    res.render("reg", {
        title: "Air BnB registration"
    });
});


app.get("/listing", (req,res)=>{

    res.render("listing", {
        title: "Air BnB Listing",
        places: listMod.places
    });
});

app.get("/login", (req,res)=>{
    res.render("login", {
        title: "Air BnB Login"
    });
});

app.post("/reg",(req,res)=>{

    const errors = []

    if (req.body.FirstName == ""){
        errors.push("*First Name: field empty")
    }
    if (req.body.LastName == ""){
        errors.push("*Last Name: field empty")
    }

    if (req.body.Email == ""){
        errors.push("*Email: feield empty")
    }
    if (req.body.Email != ""){
        const str = req.body.Email;
        if (str.includes("@") == false) {
            errors.push("*Not a Valid Email")
        }
    }

    if (req.body.PhoneNumber == ""){
        errors.push("*Phone Number: field empty")
    }

    const pass = req.body.Password;

    if (pass == ""){
        errors.push("*Password: field empty")
    }
    if (pass.length < 6) {
        errors.push("Password MUST be longer thst 6 charecters")
    }
    if (errors.length > 0){
        res.render("reg", {
            messages: errors
        })
    }
    else {
        res.render("home")            
    }
});

app.post("/login",(req,res)=>{

    const errors2 = []

    if (req.body.Username == ""){
        errors2.push("*Username: field empty")
    }
    if (req.body.Password == ""){
        errors2.push("*Password: field empty")
    }
    if (errors2.length > 0){
        res.render("home", {
            homeMsg: errors2
        })
    }
    
    else {
        res.render("home")            
    }
});
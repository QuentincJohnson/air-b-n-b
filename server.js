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

    const listingss = [
        {
            location: "Canada,ON",
            name:"Downtown Condo with View",
            rateing:"4.8",
            price:"96",
            img:"/img/condo-1.jpg"
        },
        {
            location: "Canada,QC",
            name:"Bungalow in Montreal",
            rateing:"4.7",
            price:"78",
            img:"/img/bung.jpg"
        },
        {
            location: "Canada,BC",
            name:"4 Person Beachhouse",
            rateing:"4.8",
            price:"146",
            img:"/img/beachhouse.jpg"
        },
        {
            location: "Canada,ON",
            name:"Penthouse Premium",
            rateing:"4.9",
            price:"160",
            img:"/img/penthouse.jpg"
        },
        {
            location: "Canada,ON",
            name:"Ottowa Basment",
            rateing:"4.5",
            price:"45",
            img:"/img/basement.jpg"
        },
        {
            location: "Canada,BC",
            name:"1st floor 2 person appartment",
            rateing:"4.6",
            price:"56",
            img:"/img/apt.jpg"
        },

    ];

    res.render("listing", {
        title: "Air BnB Listing",
        places: listingss
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
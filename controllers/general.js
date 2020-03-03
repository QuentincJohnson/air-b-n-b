const express = require('express')
const router = express.Router();

const listMod = require('../models/listings-list') //not a thiird party packge and gets special treatment add ./

router.get("/", (req,res)=>{
    const ftl = []
    ftl.push(listMod.places[0]);
    ftl.push(listMod.places[1])
    ftl.push(listMod.places[2])

    res.render("general/home", {
        title: "Air BnB home",
        places: ftl
    });
});

router.get("/login", (req,res)=>{
    res.render("general/login", {
        title: "Air BnB Login"
    });
});

router.post("/login",(req,res)=>{

    const errors2 = []

    if (req.body.Username == ""){
        errors2.push("*Username: field empty")
    }
    if (req.body.Password == ""){
        errors2.push("*Password: field empty")
    }
    if (errors2.length > 0){
        res.render("general/home", {
            homeMsg: errors2
        })
    }
    
    else {
        res.render("general/home")            
    }
});

router.post("/reg",(req,res)=>{

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
        res.render("general/reg", {
            messages: errors
        })
    }
    else {
        const accountSid = 'AC9c1b2a20dbb2c09e5fb28eed38b745ca';
        const authToken = '708ebe97288e22aeed919e0bd6c14284';
        const client = require('twilio')(accountSid, authToken);

        client.messages
            .create({
                 body: `From: ${req.body.FirstName} ${req.body.LastName} Varification Code : 13348`,
                 from: `14805088628`,
                 to: `${req.body.PhoneNumber}`
            })
            .then(message => {
                console.log(message.sid);
                res.render("general/home");
            });           
    }
});

module.exports = router;
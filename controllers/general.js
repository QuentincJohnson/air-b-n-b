const express = require('express')
const router = express.Router();
const userModel = require('../models/user.js');

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

router.get("/dash", (req,res)=>{
    res.render("general/dash", {
        title: "dashboard"
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

router.post("/reg",(req,res)=>
{ 
      /*
    rules for inserting into a mongoDB database USING MONGOOSE is to do the following 

    1. you have to create an instance of model, you must pass data in the form of an object  (in this case task model (task.js))
    2. from the instance, you call the save method
    
    */

   const newUser = {
    //names specified must mach the names of the schema layout
    firstName: req.body.FirstName,
    lastName: req.body.LastName,
    email: req.body.Email,
    phoneNumber: req.body.PhoneNumber,
    password: req.body.Password,
    }

    const user = new userModel(newUser);// this creates an instance of the task model schema for mongo to read in the brackets pass the datat you want inserted into the odel in the form of an object which in this case we created above
    user.save() //asynchromus means it wil return a promis and we need to handle cases with .then/.catch //// save makes the model
    .then( function(user) {
        const accountSid = process.env.TWILIO_SID;
        const authToken = process.env.TWILIO_TOKEN;
        const client = require('twilio')(accountSid, authToken);

        client.messages
            .create({
                 body: `From: ${req.body.FirstName} ${req.body.LastName} Varification Code : 13348`,
                 from: `14805088628`,
                 to: `${req.body.PhoneNumber}`
            })
            .then(message => {
                console.log(message.sid);
            });
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_KEY);
        const msg = {
            to: `${req.body.Email}`,
            from: "AirBnB@Send.org",
            subject: "Continue sign up",
            html: '<strong> to continue signup process click link ______________</strong>',
        };
        sgMail.send(msg)
        .then(()=>{
            res.render("general/dash");
        })  
        .catch(()=>{
            console.log('error sending email')
        })      
        

        console.log(user)
    })
    .catch( function(err) {

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
        console.log(errors)
        console.log(err)  
    })

});




//  router.post("/registration",(req,res)=>{

//     const errors = []

//     if (req.body.FirstName == ""){
//         errors.push("*First Name: field empty")
//     }
//     if (req.body.LastName == ""){
//         errors.push("*Last Name: field empty")
//     }

//     if (req.body.Email == ""){
//         errors.push("*Email: feield empty")
//     }
//     if (req.body.Email != ""){
//         const str = req.body.Email;
//         if (str.includes("@") == false) {
//             errors.push("*Not a Valid Email")
//         }
//     }

//     if (req.body.PhoneNumber == ""){
//         errors.push("*Phone Number: field empty")
//     }

//     const pass = req.body.Password;

//     if (pass == ""){
//         errors.push("*Password: field empty")
//     }
//     if (pass.length < 6) {
//         errors.push("Password MUST be longer thst 6 charecters")
//     }
//     if (errors.length > 0){
//         res.render("general/reg", {
//             messages: errors
//         })
//     }
//     else {
//         const accountSid = process.env.TWILIO_SID;
//         const authToken = process.env.TWILIO_TOKEN;
//         const client = require('twilio')(accountSid, authToken);

//         client.messages
//             .create({
//                  body: `From: ${req.body.FirstName} ${req.body.LastName} Varification Code : 13348`,
//                  from: `14805088628`,
//                  to: `${req.body.PhoneNumber}`
//             })
//             .then(message => {
//                 console.log(message.sid);
//             });
//         const sgMail = require('@sendgrid/mail');
//         sgMail.setApiKey(process.env.SENDGRID_KEY);
//         const msg = {
//             to: `${req.body.Email}`,
//             from: "AirBnB@Send.org",
//             subject: "Continue sign up",
//             html: '<strong> to continue signup process click link ______________</strong>',
//         };
//         sgMail.send(msg)
//         .then(()=>{
//             res.render("general/dash");
//         });          
//     }
// });

module.exports = router;
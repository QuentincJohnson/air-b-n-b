const express = require('express')
const router = express.Router();
const userModel = require('../models/user.js');
const bcrypt = require('bcryptjs')
const listMod = require('../models/listings-list') //not a thiird party packge and gets special treatment add ./
const listModel = require('../models/list.js');
const path = require("path")
const isLoggedIn = require('../middleware/auth.js')
const isAdmin = require('../middleware/adminAuth.js')


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

router.get("/dash", isLoggedIn, (req,res)=>{
    res.render("general/dash", {
        title: "dashboard"
    });
});

router.post("/login",(req,res)=>{

    //find by id only lets u search by id findone lets u search any

    //because find ONe returns the entier user document we need to hanle errors in the .then
    userModel.findOne({email: req.body.Username})
    .then(function(user){

        var errors2 = [];

        //email not found
        if(user==null){

            errors2.push('email or password incorrect')
            res.render('general/home',{
                homeMsg: errors2
            })
        }

        else{
     
            bcrypt.compare(req.body.Password, user.password)//this compares a encryptied password and the given password
            //returns a variable with true or false if its true they proceed if not render error
            .then(function(isMatch){

                if(isMatch){
                    //creats a sesion for a user so the browser knows thier data
                    req.session.userInfo= user
                    res.redirect("/dash")
                }

                else{
                    errors2.push('email or password incorrect')
                    res.render("general/home",{
                        homeMsg: errors2
                    })
                }

            })
            .catch(function(err){
                console.log(err)
                console.log("issue")

            })
        }

    })
    .catch(function(err){
        console.log(err)
    })
});

router.get("/logout",(req,res)=>{
    req.session.destroy();
    res.redirect("/")
})

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
    admin: req.body.Admin,
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
            res.redirect("/dash");
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

router.post("/reg-list",(req,res)=>
{ 
      /*
    rules for inserting into a mongoDB database USING MONGOOSE is to do the following 

    1. you have to create an instance of model, you must pass data in the form of an object  (in this case task model (task.js))
    2. from the instance, you call the save method
    
    */

   const newList = {
    //names specified must mach the names of the schema layout
    title: req.body.title,
    location: req.body.location,
    postal: req.body.postal,
    description: req.body.description,
    price: req.body.price,
    fetured: req.body.fetured,
    picString: "filler"
    }

    const list = new listModel(newList);// this creates an instance of the task model schema for mongo to read in the brackets pass the datat you want inserted into the odel in the form of an object which in this case we created above
    list.save() //asynchromus means it wil return a promis and we need to handle cases with .then/.catch //// save makes the model
    .then(function(list) {
        req.files.roomPic.name = `room_pic_${list._id}${path.parse(req.files.roomPic.name).ext}`; //the path lets us acsess the extention of the file
        req.files.roomPic.mv(`public/uploads/${req.files.roomPic.name}`)//moves the file to the path specified from the foot folder
        .then((response)=>{
            console.log("update process")
            listModel.updateOne({_id:list._id},{
                picString: req.files.roomPic.name
            })
            .then(()=>{
                res.redirect("/")
            })
            .catch(()=>{

            })

        })
        .catch((err)=>{
            console.logerr
            
        })

    })
    .catch( function(err) {
        console.log(err)  
    })

});

module.exports = router;
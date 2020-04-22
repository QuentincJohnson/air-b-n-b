const express = require('express');
const router = express.Router();
const userModel = require('../models/user.js');
const isAdmin = require('../middleware/adminAuth.js')



router.get("", (req,res)=>{
     res.render("general/reg", {
        title: "Air BnB registration"
     });
});

router.get("/make", isAdmin, (req,res)=>{
   res.render("general/make", {
      title: "Air BnB create"
   });
});



// router.post("/reg",(req,res)=>
// { 
//       /*
//     rules for inserting into a mongoDB database USING MONGOOSE is to do the following 

//     1. you have to create an instance of model, you must pass data in the form of an object  (in this case task model (task.js))
//     2. from the instance, you call the save method
    
//     */

//    const newUser = {
//     //names specified must mach the names of the schema layout
//     firstName: req.body.FirstName,
//     lastName: req.body.LastName,
//     email: req.body.Email,
//     password: req.body.PhoneNumber,
//     cpassword: req.body.Password,
//     }

//     const user = new userModel(newUser);// this creates an instance of the task model schema for mongo to read in the brackets pass the datat you want inserted into the odel in the form of an object which in this case we created above
//     user.save() //asynchromus means it wil return a promis and we need to handle cases with .then/.catch //// save makes the model
//     .then( function(user) {
//         console.log(user)
//     })
//     .catch( function(err) {
//         console.log(err)  
//     })

// });

//Route to direct user to the login form
module.exports = router;
const express = require('express');
const router = express.Router();
const userModel = require('../models/user.js');
const isAdmin = require('../middleware/adminAuth.js')
const listModel = require('../models/list.js')
const path = require("path")




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

router.get("/mylist", isAdmin, (req,res)=>{
   const useName = req.session.userInfo.email
   listModel.find({createdBy: useName}) // you can search from collection for example if i wanted to pull documents with status open in the brackets write {status: 'open'}
    .then(function(response){
       console.log(response)
        //filter out the response array wich will be the collection of documents of the collection specified in find(). filter out only the things we want 
        const myList = response.map( list=>{


            return{
                _id: list._id,
                title: list.title,
                location: list.location,
                postal: list.postal,
                description: list.description,
                price: list.price,
                picString: list.picString
            }
            
        })
        res.render("general/mylist",{
           data: myList
        })

   })
   .catch(function(response){

   })

})

router.get("/edit/:_id",(req,res)=>{ 

   listModel.findById(req.params._id) // use req.params.id to use the variable "id" set in the URL //this will return either a 0 or 1, 0 if there is no matching ID or 1 with the id of the document you past 
   .then(function(response){
       const {_id,title,description,fetured,price,location,postal,picString} = response;
       res.render("general/listedit",{ //now we pass them to the handlebars page so we can use it to fill in the page 
           _id,
           title,
           description,
           fetured,
           location,
           price,
           postal,
           picString
           
       })

   })
   .catch(function(err){
       console.log(err)

   })
})

router.put("/update/:_id",(req,res)=>{
   //capture all the data from the form 
   listModel.findById(req.params._id)
   .then(function(response){
      const {_id,title,description,fetured,price,location,postal,picString} = response;
      const list = 
      {
         _id: req.params._id,
         title: req.body.title,
         location: req.body.location,
         postal: req.body.postal,
         description: req.body.description,
         price: req.body.price,
         picString: picString
      }

      console.log(list)

      //update one updates a single document in a collection
      listModel.updateOne({_id:req.params._id},list)// this is a conditonal statment that updates the one document. it checks if the id given is equall to a id in the document. if it is it updates it with the object you put as the second argument
      .then(function(response){
         // if its sucsessful it will redirect to the task dashboard
         res.redirect("/dash")

      })
      .catch(function(err){
         console.log(`error called: ${err}`)
      })
      })
   .catch(function(err){

   });

   
})

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
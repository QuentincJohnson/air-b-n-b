const express = require('express')
const router = express.Router();
const listModel = require('../models/list.js');


router.get("",(req,res)=>
{
    //use find if you want to pull multiple values
    //pull from the database, get the results that was returned then inject the results into the daskboard 
    listModel.find() // you can search from collection for example if i wanted to pull documents with status open in the brackets write {status: 'open'}
    .then(function(response){
        //filter out the response array wich will be the collection of documents of the collection specified in find(). filter out only the things we want 
        const filteredList = response.map( list=>{


            return{
                title: list.title,
                location: list.location,
                postal: list.postal,
                description: list.description,
                price: list.price,
                picString: list.picString
            }
            
        })
        console.log(filteredList)
        res.render("general/listing",{
            data: filteredList
        });
        
    })
    .catch(function(err){
        console.log(`pull error: ${err}`)
    })// returns a promise almost all crud operations return a promes
    
  
});




module.exports = router;
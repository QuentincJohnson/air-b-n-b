const express = require('express')
const router = express.Router();

const listMod = require('../models/listings-list') //not a thiird party packge and gets special treatment add ./

router.get("", (req,res)=>{

    res.render("general/listing", {
        title: "Air BnB Listing",
        places: listMod.places
    });
});




module.exports = router;
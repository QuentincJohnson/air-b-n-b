const express = require('express')
const router = express.Router();

router.get("", (req,res)=>{
    res.render("general/reg", {
        title: "Air BnB registration"
    });
});




module.exports = router;
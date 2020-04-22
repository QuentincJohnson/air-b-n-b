const isAdmin = (req,res,next)=>{
    console.log(req.session.userInfo)
    if(res.locals.user){   
        if(req.session.userInfo.admin=='yes'){
            
            next();
        }
        else
        (
            res.redirect('/dash')
        )
       
    }
    else{
        res.redirect('/')
    }
       
       
    
}

module.exports = isAdmin
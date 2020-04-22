const isAdmin = (req,res,next)=>{
    if(req.session.userInfo){
        if(req.session.userInfo.admin=='yes'){
            next();
        }
        else
        (
            res.redirect('/dash')
        )
       
    }
    else(
        res.redirect('/')
    )
}

module.exports = isAdmin
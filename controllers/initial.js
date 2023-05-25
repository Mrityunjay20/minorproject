let csigninstatus = false;

exports.renderhome= (req,res)=>{
    res.render("home",{signinstatus: csigninstatus});
}

exports.renderlogin=(req,res)=>{
    res.render("login",{signinstatus: csigninstatus});  
}

exports.resetpass=(req,res)=>{
    res.render("reset",{signinstatus: csigninstatus});  
}
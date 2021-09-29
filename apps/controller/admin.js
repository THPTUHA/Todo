var express=require("express");
var router=express.Router();
var user_md=require("../models/user");
var helper=require("../helpers/helper");


router.get("/",function(req,res){
    res.json({"message":"AdminPage"});
});

router.get("/signup",function(req,res){
    res.render("signup",{data:{}});
});

router.post("/signup",function(req,res){
    var user=req.body;
    if(user.email.trim().length==0){
        res.render("signup",{data:{error:"Email is required"}});
    }
    if(user.password.trim().length==0){
        res.render("signup",{data:{error:"Password is required"}});
    }
    if(user.password.trim()!=user.repassword.trim()){
        res.render("signup",{data:{error:"Password is not match"}});
    }
    if(user.firstname.trim().length==0){
        res.render("signup",{data:{error:"Please enter firstname"}});
    }
    if(user.lastname.trim().length==0){
        res.render("signup",{data:{error:"Please enter lastname"}});
    }
    var password=helper.hash_password(user.password);
    console.log(password);
    user={
        email:user.email,
        password:password,
        first_name:user.firstname,
        last_name:user.lastname
    };
    var result=user_md.addUser(user);

    result.then(function(data){
        res.json({"message":"succes"});
    }).catch(function(err){
        console.log(err);
        res.render("signup",{data:{error:"error"}});
    })
});


module.exports=router;
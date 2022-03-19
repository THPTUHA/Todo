var express=require("express");
const { async } = require("q");
var router=express.Router();
var helper=require("../helpers/helper");
const { User } = require("../models/user");

router.use("/admin",require(__dirname+"/admin"));
router.use("/user",require(__dirname+"/user"));



router.get("/",function(req,res){
    res.render("home");
});

router.get("/signup",function(req,res){
    res.render("signup",{data:{}});
});

router.post("/signup",async function(req,res){
    var user=req.body;
    var len=user.email.trim().length;
    if(user.email.trim().length==0){
        res.render("signup",{data:{error:"Email is required"}});
    }else if(len<=10||user.email.substring(len-10,len)!="@gmail.com"){
        res.render("signup",{data:{error:"Email is invalid"}});
    }else
    if(user.password.trim().length==0){
        res.render("signup",{data:{error:"Password is required"}});
    }else
    if(user.password.trim()!=user.repassword.trim()){
        res.render("signup",{data:{error:"Password is not match"}});
    }else
    if(user.firstname.trim().length==0){
        res.render("signup",{data:{error:"Please enter firstname"}});
    }else
    if(user.lastname.trim().length==0){
        res.render("signup",{data:{error:"Please enter lastname"}});
    }
    else{
        var password=helper.hash_password(user.password);
        user={
            email:user.email,
            password:password,
            first_name:user.firstname,
            last_name:user.lastname,
            create_at: new Date()
        };
        User.get({email: user.email},{limit: 1}).then((user_exist)=>{
            if(user_exist)  res.render("signup",{data:{error:"Email already exists"}});
            else {
                User.add(user).then(result=>{
                    res.redirect("/signin");
                }).catch(error=>{
                    res.render("signup",{data:{error:error}});
                })
            }
        }).catch(error=>{
            res.render("signup",{data:{error:error}});
        });

    }
});

router.get("/signin",async function(req,res){
    res.render("signin",{data:{}});
});

router.post("/signin",async function(req,res){
    var params=req.body;
    var len=params.email.trim().length;
    if(params.email.trim().length==0){
        res.render("signin",{data:{error:"Please enter an email"}});
    }else if(len<=10||params.email.substring(len-10,len)!="@gmail.com"){
        res.render("signup",{data:{error:"Email is invalid"}});
    }else if(params.password.trim().length==0){
        res.render("signin",{data:{error:"Please enter an password"}});
    }

    User.get({email: params.email}, {limit:1}).then((user)=>{
        if(!user){
            res.render("signin",{data:{error:"Email is invalid!"}});
        }
        var status=helper.compare(params.password,user.password);
        if(status){
            req.session.user=user;
            res.redirect("/user/profile/"+user.id);
        }else{
            res.render("signin",{data:{error:"Password is Wrong"}});
        }
    }).catch((error)=>{
        res.render("signin",{data:{error:error}});
    });

});


module.exports=router;
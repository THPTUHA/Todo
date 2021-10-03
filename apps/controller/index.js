var express=require("express");
var router=express.Router();
var helper=require("../helpers/helper");
var user_md=require("../models/user");

router.use("/admin",require(__dirname+"/admin"));
router.use("/user",require(__dirname+"/user"));



router.get("/",function(req,res){
    res.render("home");
});

router.get("/signup",function(req,res){
    res.render("signup",{data:{}});
});

router.post("/signup",function(req,res){
    var user=req.body;
    var len=user.email.trim().length;
    if(user.email.trim().length==0){
        res.render("signup",{data:{error:"Email is required"}});
    }else if(len<10||user.email.substring(len-10,len)!="@gmail.com"){
        res.render("signup",{data:{error:"Email is valid"}});
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
        var result=user_md.addUser(user);
        result.then(function(data){
            res.redirect("signin");
        }).catch(function(err){
            console.log(err);
            res.render("signup",{data:{error:"error"}});
        })
    }
});

router.get("/signin",function(req,res){
    res.render("signin",{data:{}});
});

router.post("/signin",function(req,res){
    var params=req.body;
    if(params.email.trim().length==0){
        res.render("signin",{data:{error:"Please enter an email"}});
    }
    if(params.password.trim().length==0){
        res.render("signin",{data:{error:"Please enter an password"}});
    }
    var data=user_md.getUserByEmail(params.email);
    if(data){
        data.then(function(users){
            var user=users[0];
            var status=helper.compare(params.password,user.password);
            if(status){
                req.session.user=user;
                res.redirect("/user/profile/"+user.email);
            }else{
                res.render("signin",{data:{error:"Password is Wrong"}});
            }
        })
    }else{
        res.render("signin",{data:{error:"Email not exists"}});
    }
});


module.exports=router;
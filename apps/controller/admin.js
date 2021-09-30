var express=require("express");
var router=express.Router();
var user_md=require("../models/user");
var post_md=require("../models/posts");

var helper=require("../helpers/helper");


router.get("/",function(req,res){
    var data=post_md.getAllPosts();
    data.then(function(posts){
        var post={
            posts:posts,
            error:false
        };
        res.render("admin/dashboard",{data:post});
    }).catch(function(error){
        res.render("admin/dashboard",{data:"Get posts data fault"});
    });
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
        // res.redirect("/admin/signin");
    }).catch(function(err){
        console.log(err);
        res.render("signup",{data:{error:"error"}});
    })
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
                console.log(req.session.user);
                res.redirect("/admin");
            }else{
                res.render("signin",{data:{error:"Password is Wrong"}});
            }
        })
    }else{
        res.render("signin",{data:{error:"Email not exists"}});
    }
});

router.get("/post/new",function(req,res){
    res.render("admin/post/new",{data:""});
});

router.post("/post/new",function(req,res){
    var params=req.body;
    if(params.title.trim().length==0){
        var data={
            error:"Please enter a title"
        };
        res.render("admin/post/new",{data:data});
    }else{
        var now=new Date();
        params.created_at= now;
        params.update_at=now;
        var data=post_md.addPost(params);
        data.then(function(data){
            res.redirect("/admin");
        }).catch(function(error){
            var data={
                error:"Could not insert post"
            };
            res.render("admin/post/new",{data:data});
        })
    }
});


module.exports=router;
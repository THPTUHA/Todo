var express=require("express");
var router=express.Router();
var user_md=require("../models/user");
var post_md=require("../models/posts");



router.get("/",function(req,res){
    if(req.session.user){
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
    }else{
        res.redirect("/signin");
    }
});


router.get("/post/new",function(req,res){
    if(req.session.user){
        res.render("admin/post/new",{data:""});
    }else{
        res.redirect("/signin");
    }
    
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
            res.render("post/new",{data:data});
        })
    }
});

router.get("/post/edit/:id",function(req,res){
    if(req.session.user){
        var params=req.params;
        var id=params.id;
        var data=post_md.getPostById(id);
        data.then(function(posts){
            var post=posts[0];
            var data={
                post:post,
                error:false
            }
            res.render("admin/post/edit",{data:data});
        }).catch(function(error){
            var data={
                error:"Could not edit post!"
            }
            res.render("admin/post/edit",{data:data});
        })
    }else{
        res.redirect("/signin");
    }
    
});

router.put("/post/edit",function(req,res){
    var params=req.body;
    var data=post_md.updatePost(params);
    if(data){
        data.then(function(result){
            res.json({status_code:200});
        }).catch(function(error){
            res.json({status_code:500});
        });
    }else{
        res.json({status_code:500});
    }
});

router.delete("/post/delete",function(req,res){
    var post_id=req.body.id;
    var data=post_md.deletePost(post_id);
    if(data){
        data.then(function(result){
            res.json({status_code:200});
        }).catch(function(error){
            res.json({status_code:500});
        })
    }else{
        res.json({status_code:500});
    }
});

router.get("/user",function(req,res){
    if(req.session.user){
        var data=user_md.getAllUsers();
        data.then(function(users){
            var data={
                users:users
            }
            res.render("admin/user",{data:data});
        }).catch(function(error){
            var data={error:"Could not get users"};
            res.render("admin/user",{data:data});
        });
    }else{
        res.redirect("/signin");
    }
});

module.exports=router;
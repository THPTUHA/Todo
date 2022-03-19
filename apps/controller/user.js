const e = require("express");
var express=require("express");
const { Task } = require("../models/task");
var router=express.Router();
var task_md=require("../models/task");
const user = require("../models/user");


const page_size = 10;

router.get("/profile/:id",function(req,res){
    const user = req.session.user;
    if(user){
        id = req.params.id;
        Task.get({user_id: user.id},{limit: page_size}).then((tasks)=>{
            res.render("todoUser/index",{data: {tasks: tasks}});
        }).catch((error)=>{
            console.log(error);
            res.render("todoUser/index",{error: error});
        })
    }else{
        res.redirect("/signin");
    }
   
});


router.post("/tasks/delete",function(req,res){
    if(req.session.user){
        const id = req.body.id;
        Task.delete({id: id}).then((result)=>{
            res.json({status_code:200});
        }).catch((error)=>{
            res.json({status_code: 200, error: true});
        })
    }else res.redirect("/signin");
});

router.post("/tasks/update",function(req,res){
    if(req.session.user){
        const {description, name, content,id} = req.body;
        const task = {
            description: description,
            name: name,
            content: content
        }
        Task.update([task,{id:id}]).then((result)=>{
            res.json({status_code:200,id: result.id});
        }).catch((error)=>{
            res.json({status_code:200, error: true});
        })
       
    }else res.redirect("/signin");
});

router.post("/tasks/add",function(req,res){
    const user = req.session.user;
    if(user){
        const {description, name,content} = req.body;
        const task = {
            user_id: user.id,
            description: description ? description:"",
            name: name,
            content: content,
            status: 0
        }
        Task.add([task, {id:id}]).then((result)=>{
            task.id = result.insertId;
            res.json({status_code:200,task});
        }).catch((error)=>{
            res.json({status_code:200, error: true});
        })
       
    }else res.redirect("/signin");
});

router.post("/tasks/change_status",function(req,res){
    if(req.session.user){
        const {id, status} = req.body;
        const task = {
            status: status
        }
        Task.update([task, {id:id}]).then((result)=>{
            res.json({status_code:200,id: result.id});
        }).catch((error)=>{
            res.json({status_code:200, error: true});
        })
       
    }else res.redirect("/signin");
});

router.put("/sort_tasks",function(req,res){
    if(req.session.user){
        var params=req.body.mp;
        var data=task_md.updatePosition(email,params);
        data.then(function(result){
            res.json({status_code:200});
        }).catch(function(error){
        })
    }else  res.redirect("/signin");
})

module.exports=router;
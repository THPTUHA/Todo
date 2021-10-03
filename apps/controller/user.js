const e = require("express");
var express=require("express");
var router=express.Router();
var task_md=require("../models/task");
var id_task=0;
var email="";

router.get("/profile/:email",function(req,res){
    email=req.params.email;
    var len=email.length;
    email=email.substring(0,len-10);
    var data=task_md.getAllTasks(email);
    data.then(function(tasks){
        var len=tasks.length;
        tasks.email=email;
        if(len){
            id_task=tasks[len-1].id_task;
            var mp=[];
            for(var i=0;i<len;++i)mp.push({pos:tasks[i].position,num:i});
            mp.sort((a,b)=>{return a.pos-b.pos;});
             console.log(mp);
        }
        // console.log(tasks);
        var data={tasks:tasks,mp:mp};
        res.render("blog/index",{data:data});
    }).catch(function(error){
        console.log(error);
    })
});


router.delete("/delete",function(req,res){
    var id_task=req.body.id_task;
    var data=task_md.deleteTask(id_task,email);
    data.then(function(result){
        res.json({status_code:200});
    }).catch(function(error){
        console.log(error);
    })
});

router.put("/edit/done",function(req,res){
    var params=req.body;
    var data=task_md.updateTaskDone(email,params);
    data.then(function(result){
        res.json({status_code:200});
    }).catch(function(error){
        console.log(error);
    })
});

router.put("/edit/failure",function(req,res){
    var params=req.body;
    var data=task_md.updateTaskFailure(email,params);
    data.then(function(result){
        res.json({status_code:200});
    }).catch(function(error){
        console.log(error);
    })
});

router.put("/edit/task",function(req,res){
    var params=req.body;
    var data=task_md.updateTask(email,params);
    data.then(function(result){
        res.json({status_code:200});
    }).catch(function(error){
        console.log(error);
    })
});

router.post("/add/task",function(req,res){
    var params=req.body;
    params.id_task=++id_task;
    console.log(params);
    var data=task_md.addTask(email,params);
    data.then(function(result){
        res.json({status_code:200,id_task:id_task});
    }).catch(function(error){
        console.log(error);
    })
});

router.put("/sortTasks",function(req,res){
    var params=req.body.mp;
    var data=task_md.updatePosition(email,params);
    data.then(function(result){
        res.json({status_code:200});
    }).catch(function(error){
        console.log(error);
    })
});

module.exports=router;
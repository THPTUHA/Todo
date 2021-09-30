var express=require("express");
var router=express.Router();
router.use("/admin",require(__dirname+"/admin"));
router.use("/user",require(__dirname+"/user"));
router.get("/",function(req,res){
//    res.json({"message":"HomePage"});
    res.render("home");
});

module.exports=router;
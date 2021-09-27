var express=require('express');
var config=require('config');
var bodyParser=require('body-parser');

var app=express();
app.use(bodyParser.json());
app.set("views",__dirname+"/apps/views");
app.set("view engine","ejs");
var controllers=require(__dirname+"/apps/controller");


app.use(controllers);
var host=config.get("server.host");
var port=config.get("server.port");
app.listen(port,host,function(){
  console.log("Running");
});
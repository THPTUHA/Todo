var express=require('express');
var config=require('config');
var bodyParser=require('body-parser');
var path=require('path');
var session =require('express-session');

var app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//session
app.set("trust proxy",1);
app.use(session({
  secret:config.get("secret_key"),
  resave:false,
  saveUninitialized:true,
  cookie:{secure:true}
}));

app.set("views",__dirname+"/apps/views");
app.set("view engine","ejs");
var controllers=require(__dirname+"/apps/controller");

app.use(controllers);
app.use('/static',express.static(path.join(__dirname, 'public')));

var host=config.get("server.host");
var port=config.get("server.port");
app.listen(port,host,function(){
  console.log("Running");
});
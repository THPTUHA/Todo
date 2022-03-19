var q=require("q");
var db=require("../common/database");
var connection=db.getConnection();
var mysql=require("mysql");

class User{
    static get(option, limit){
        const query = mysql.format(`SELECT * FROM users WHERE ? ${limit && limit.limit ? "LIMIT " + limit.limit:""}`,option);
        return new Promise(function(resolve, reject){
            connection.query(query,option,function(err,results){
                if(err) reject("ERROR!");
                if(limit && limit.limit == 1) resolve(results[0]);
                resolve(results);
            });
        })
    }

    static add(user){
        const query = mysql.format("INSERT INTO users SET ?",user);
        console.log("query add",query,user);
        return new Promise(function(resolve,reject){
            connection.query(query,function(err,result){
                if(err){
                    console.log(err);
                    reject("Error!");
                }
                resolve(result);
            });
        })
    }
}

module.exports={
    User: User
}
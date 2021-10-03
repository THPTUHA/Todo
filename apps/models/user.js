var q=require("q");
var db=require("../common/database");
var connection=db.getConnection();

function addUser(user){
    if(user){
        var defer=q.defer();
        connection.query('INSERT INTO users SET ?',user,function(err,result){
            if(err){
                defer.reject(err);
            }else{
                defer.resolve(result);
            }
        });
        var len=user.email.length;
        var sql="CREATE TABLE if not exists "+user.email.substring(0,len-10)+ "(id_task INT AUTO_INCREMENT PRIMARY KEY,title VARCHAR(255),content MEDIUMTEXT,done INT ,failure INT ,created_at DATETIME,updated_at DATETIME,position INT)"
        connection.query(sql ,function(err,result){
            if(err){
                defer.reject(err);
            }else{
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}

function getUserByEmail(email){
    var defer=q.defer();
    var query=connection.query("SELECT * FROM users WHERE ?", {email:email},function(err,result){
        if(err)defer.reject(err);
        else {
            defer.resolve(result);
        }
    });
    return defer.promise;
}

function getAllUsers(){
    var defer=q.defer();
    var query=connection.query("SELECT * FROM users",function(err,result){
        if(err)defer.reject(err);
        else {
            defer.resolve(result);
        }
    });
    return defer.promise;
}
module.exports={
    addUser:addUser,
    getUserByEmail:getUserByEmail,
    getAllUsers:getAllUsers
}
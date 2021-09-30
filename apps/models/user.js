var q=require("q");
var db=require("../common/database");
var connection=db.getConnection();

function addUser(user){
    if(user){
        var defer=q.defer();
        var query=connection.query('INSERT INTO users SET ?',user,function(err,result){
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

module.exports={
    addUser:addUser,
    getUserByEmail:getUserByEmail
}
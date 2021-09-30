var q=require("q");
var db=require("../common/database");
var connection=db.getConnection();

function getAllPosts(){
    var defer=q.defer();
    var query=connection.query('SELECT * FROM posts',function(err,result){
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(result);
        }});
    return defer.promise;
}

function addPost(params){
    if(params){
        var defer=q.defer();
        var query=connection.query('INSERT INTO posts SET ?',params,function(err,result){
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

module.exports={
    getAllPosts:getAllPosts,
    addPost:addPost
}
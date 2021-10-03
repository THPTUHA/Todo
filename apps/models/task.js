var q=require("q");
var db=require("../common/database");
var connection=db.getConnection();

function getAllTasks(email){
    var defer=q.defer();
    connection.query("SELECT * FROM "+email,function(err,result){
        if(err)defer.reject(err);
        else {
            defer.resolve(result);
        }
    });
    return defer.promise;
}

function deleteTask(id_task,email){
    var defer=q.defer();
    connection.query("DELETE FROM "+email+" WHERE id_task=?",[id_task],function(err,result){
        if(err)defer.reject(err);
        else {
            defer.resolve(result);
        }
    });
    return defer.promise;
}

function updateTaskDone(email,params){
    if(params){
        var defer=q.defer();
        connection.query("UPDATE "+email+" SET done=? ,updated_at=? WHERE id_task=?",
        [params.done,new Date(),params.id_task],function(err,result){
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

function updateTaskFailure(email,params){
    if(params){
        var defer=q.defer();
        connection.query("UPDATE "+email+" SET failure=? ,updated_at=? WHERE id_task=?",
        [params.failure,new Date(),params.id_task],function(err,result){
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

function updateTask(email,params){
    if(params){
        var defer=q.defer();
        connection.query("UPDATE "+email+" SET title=?, content=?,updated_at=? WHERE id_task=?",
        [params.title,params.content,new Date(),params.id_task],function(err,result){
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

function addTask(email,params){
    if(params){
        var defer=q.defer();
        connection.query("INSERT INTO "+email+" SET id_task=?,title=?, content=?,done=?, failure=?,created_at=?,position=? ",
        [params.id_task,params.title,params.content,0,0,new Date(),params.position],function(err,result){
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

function updatePosition(email,params){
    if(params){
        var defer=q.defer();
        for(var i=0;i<params.length;++i){
            connection.query("UPDATE "+email+" SET position=?,updated_at=? WHERE id_task=?",
            [params[i].pos,new Date(),params[i].id_task],function(err,result){
                if(err){
                    defer.reject(err);
                }else{
                    defer.resolve(result);
                }
            });
        }
        return defer.promise;
    }
    return false;
}

module.exports={
    getAllTasks:getAllTasks,
    deleteTask:deleteTask,
    updateTaskDone:updateTaskDone,
    updateTaskFailure:updateTaskFailure,
    updateTask:updateTask,
    addTask:addTask,
    updatePosition:updatePosition
}
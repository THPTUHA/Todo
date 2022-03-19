var q=require("q");
var db=require("../common/database");
var connection=db.getConnection();
const mysql=require("mysql");
const { promiseQuery } = require("../helpers/helper");

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

class Task{
    static get(option,limit){
        const query = mysql.format(`SELECT * FROM tasks WHERE ? ${limit && limit.limit ? "LIMIT " + limit.limit:""}`, option);
        return promiseQuery(query);
    }

    static add(option){
        const query = mysql.format(`INSERT INTO tasks SET ?`, option);
        return promiseQuery(query);
    }

    static delete(option){
        const query = mysql.format(`DELETE FROM tasks WHERE ?`,option);
        return promiseQuery(query);
    }

    static update(options){
        const query = mysql.format(`UPDATE tasks SET ? WHERE ?`,options);
        return promiseQuery(query);
    }

}
module.exports={
    Task: Task
}
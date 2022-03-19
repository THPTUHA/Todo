var bcrypt=require("bcrypt");
const { has } = require("config");
var config=require("config");
const db=require("../common/database");
const connection= db .getConnection();

function hash_password(password){
    var saltRounds=config.get("salt");
    var salt=bcrypt.genSaltSync(saltRounds);
    var hash=bcrypt.hashSync(password,salt);
    return hash;
}

function compare(password,hash){
    return bcrypt.compareSync(password,hash);
}

function promiseQuery(query){
    return new Promise((resolve, reject)=>{
        connection.query(query,(error, result)=>{
            if(error) reject(error);
            resolve(result);
        })
    })
}

module.exports={
    hash_password:hash_password,
    compare:compare,
    promiseQuery: promiseQuery
}
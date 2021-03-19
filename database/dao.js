const db = require("./database.js")
const crypt = require("../crypt")

//create record
//get single record
//get all records
//delete record
//update record




//create record
function createRecord(tableName,DataObject,next){
    var sql = "";
    var params = null;
    
    switch(tableName){
        case "user":
            sql ='INSERT INTO user (name, email, password) VALUES (?,?,?)';
            params = [DataObject.name, DataObject.email, crypt.syncPassHash(DataObject.password)];
            break;
        case "blog":
            //here add the blog table details
            break;
        case "default":
            break;
    }
    // let payload = null;
    return db.run(sql, params, function (err, result) {
        if (err){
            return({ status : 400 , message: err.message });
        }
        else
            return({
            "message": "success",
            "data": result,
            "id" : this.lastID
        });
    });
    // console.log(payload)
    // return payload;
}

//get single record
function getRecordById(tableName,id){
    var sql = "select * from ? where id = ?"
    var params = [tableName, id]
    return db.get(sql, params, (err, row) => {
        if (err) {
          return { status : 400 , message: err.message };
        }
        return{
            "message":"success",
            "data":row.name
        }
      });
}

//get all records
function getAllRecords(tableName){
    var sql = "select * from user"
    var params = [tableName]
    console.log(sql)
    return db.all(sql, params, (err, rows) => {
        if (err) {
          return ({ status : 400 , message: err.message });
        }
        else{
            console.log(rows)
            return({
            "message":"success",
            "data":rows
            })
        }
      });
}

//Update Records
function updateRecord(DataObject){
    db.run(
        `UPDATE user set 
           name = coalesce(?,name), 
           email = COALESCE(?,email), 
           password = coalesce(?,password) 
           WHERE id = ?`,
        [DataObject.name, DataObject.email, DataObject.password, DataObject.params.id],
        (err, result) => {
            if (err){
                return { status : 400 , message: err.message };
            }
            return({
                message: "success",
                data: data
            })
    });
}

//delete record
function deleteRecordById(tableName,id){
    db.run(
        'DELETE FROM ? WHERE id = ?',
        [tableName,id],
        function (err, result) {
            if (err){
                return { status : 400 , message: err.message };
            }
            return({"message":"deleted", rows: this.changes})
    });
}

module.exports = dao = {
    createRecord,
    getRecordById,
    getAllRecords,
    updateRecord,
    deleteRecordById
}
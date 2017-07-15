var express = require('express');
var bodyParser = require('body-parser');
var passwordHash = require('password-hash');
const nodemailer = require('nodemailer');
const hashSalt = "fjsdklrepublic0149348.,9@kfzxmn";
var scanRouter = express.Router();
var mysql      = require('mysql');
//var connection = mysql.createConnection('mysql://b6f61539e0b3f6:1fa9e50f@us-cdbr-iron-east-04.cleardb.net/heroku_4af0ef73ab05633?reconnect=true');
// var url = process.env.CLEARDB_DATABASE_URL || 'mysql://root@localhost/mydb?reconnect=true';
// var connection = mysql.createConnection(url);

***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
var connection = mysql.createConnection({
***REMOVED***
***REMOVED***
***REMOVED***
  port     : 3306,
  database : "fyp"
});



var outerSuccess = {};
scanRouter.use(bodyParser.json());
scanRouter.route('/')
.post(function(req, res) {
  sql = "INSERT INTO Scan_result (scan_date,patient_id) VALUES (NOW()," + req.body.patient_id + ")";
  console.log(sql);
  connection.query(sql, function(err, outerSuccess, fields) {
    if (err){
      res.json({success:false});
       throw err;
    }
    console.log(outerSuccess);
    analysisSql = "INSERT INTO Scan_analysis (isNormal,analysis_date) VALUES ('"+req.body.glucose.isNormal+"',NOW())";
    console.log(analysisSql);
    connection.query(analysisSql, function(err, success, fields) {
      if (err){
        res.json({success:false});
         throw err;
      }
      console.log(success);
      dataSql = "INSERT INTO Parameter_has_scan_result (result_id,parameter_id,reading_json,analysis_id) "+
      "VALUES ("+outerSuccess.insertId +",1"+",'"+req.body.glucose.raw+ "',"+success.insertId+")";
      console.log(dataSql);
      connection.query(dataSql, function(err, success, fields) {
        if (err){
          res.json({success:false});
           throw err;
        }
        console.log(success);
        res.json({success:true});
      });
    });

  });


});



module.exports = scanRouter;

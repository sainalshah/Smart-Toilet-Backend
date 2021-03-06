var express = require('express');
var bodyParser = require('body-parser');
var passwordHash = require('password-hash');
const nodemailer = require('nodemailer');
const hashSalt = "fjsdklrepublic0149348.,9@kfzxmn";
var scanRouter = express.Router();
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : "",
  user     : "",
  password : "",
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
    analysisSql = `INSERT INTO Scan_analysis (isNormal,analysis_date) VALUES (${req.body.glucose.isNormal},NOW())`;
    console.log(analysisSql);
    connection.query(analysisSql, function(err, success, fields) {
      if (err){
        res.json({success:false});
        throw err;
      }

      dataSql = "INSERT INTO Parameter_has_scan_result (result_id,parameter_id,reading_json,analysis_id) "+
      "VALUES ("+outerSuccess.insertId +",1"+",'"+req.body.glucose.raw+ "',"+success.insertId+")";
      console.log(dataSql);
      connection.query(dataSql, function(err, success, fields) {
        if (err){
          res.json({success:false});
          throw err;
        }

        analysisSql = `INSERT INTO Scan_analysis (isNormal,analysis_date) VALUES (${req.body.ph.isNormal},NOW())`;
        console.log(analysisSql);
        connection.query(analysisSql, function(err, success, fields) {
          if (err){
            res.json({success:false});
            throw err;
          }

          dataSql = "INSERT INTO Parameter_has_scan_result (result_id,parameter_id,reading_json,analysis_id) "+
          "VALUES ("+outerSuccess.insertId +",2"+",'"+req.body.ph.raw+ "',"+success.insertId+")";
          console.log(dataSql);
          connection.query(dataSql, function(err, success, fields) {
            if (err){
              res.json({success:false});
              throw err;
            }
            res.json({success:true});
          });
        });
      });
    });
  });
});

scanRouter.route('/:id')
.get(function(req, res){
  console.log("id is ",req.params.id);
  console.log("success from scan router");
  //var sql = 'SELECT result_id, isNormal FROM fyp.Scan_analysis , Scan_result , parameter_has_scan_result where Scan_result.result_id =parameter_has_scan_result.result_id , parameter_has_scan_result.analysis_id = Scan_result.analysis_id , user_id=? , order by result_id desc Limit 2 ;';
  var sql = `SELECT fyp.Parameter_has_scan_result.parameter_id,
fyp.Parameter_has_scan_result.result_id,patient_id,
isNormal FROM fyp.Scan_analysis ,User, Scan_result ,
Parameter_has_scan_result where
Scan_result.result_id =Parameter_has_scan_result.result_id
and Parameter_has_scan_result.analysis_id = Scan_analysis.analysis_id
and Scan_result.patient_id=User.user_id
and patient_id=?
order by  fyp.Parameter_has_scan_result.result_id desc, Scan_result.scan_date desc Limit 2;`
  //var sql = 'Select * FROM User where user_id = ?;';
  connection.query(sql,[req.params.id], function(err, result, fields) {
    if (err) throw err;
    // console.log("staff id: " + staff[0].staff_id);
    // console.log("just now entered password is correct: "+pwdHash.verify(pwd, staff[0].password));
    // console.log("password from database: "+staff[0].password);
    console.log("success");
    console.log(result);
    var success = {data:result};
    res.json(success);
  });

});
scanRouter.route('/historic/:id')
.get(function(req, res){
  console.log("id is ",req.params.id);
  console.log("success");
  //var sql = 'SELECT result_id, isNormal FROM fyp.Scan_analysis , Scan_result , parameter_has_scan_result where Scan_result.result_id =parameter_has_scan_result.result_id , parameter_has_scan_result.analysis_id = Scan_result.analysis_id , user_id=? , order by result_id desc Limit 2 ;';
  var sql = `SELECT PSR.disease_has_result_id, PSR.parameter_id, PSR.result_id,
SR.patient_id, SA.isNormal, DATE_FORMAT(SR.scan_date, "%Y-%m-%d") AS scan_date, DATE_FORMAT(SR.scan_date, "%H:%m:%s") AS scan_time, PSR.reading_json
FROM Scan_analysis SA, User U, Scan_result SR, Parameter_has_scan_result PSR
 where SR.result_id = PSR.result_id
 and PSR.analysis_id = SA.analysis_id
 and SR.patient_id= U.user_id
 and SR.patient_id=?
 order by SR.scan_date;`
  //var sql = 'Select * FROM User where user_id = ?;';
  connection.query(sql,[req.params.id], function(err, result, fields) {
    if (err) throw err;
    // console.log("staff id: " + staff[0].staff_id);
    // console.log("just now entered password is correct: "+pwdHash.verify(pwd, staff[0].password));
    // console.log("password from database: "+staff[0].password);
    console.log("success");
    console.log(result);
    var success = {data:result};
    res.json(success);
  });

});

module.exports = scanRouter;

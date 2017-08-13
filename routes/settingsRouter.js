var express = require('express');
var bodyParser = require('body-parser');
var passwordHash = require('password-hash');
const nodemailer = require('nodemailer');
const hashSalt = "fjsdklrepublic0149348.,9@kfzxmn";
var settingRouter = express.Router();
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : "",
  user     : "",
  password : "",
  port     : 3306,
  database : "fyp"
});



***REMOVED***

settingRouter.use(bodyParser.json());
settingRouter.route('/')
.post(function(req, res) {
  //console.log(req);
  // let formattedDate = req.body.appointment_date.slice(0,10);
  // console.log(formattedDate+'",'+false+','+req.body.patient_id+','+req.body.time_of_day_id+','+req.body.clinic_id+')');
  //var sql = 'insert into Appointment(appointment_date,is_request_sent,patient_id,time_of_day_id,clinic_id) values("'+formattedDate+'",'+false+','+req.body.patient_id+','+req.time_of_day_id+','+req.body.clinic_id+')';
  user_id = req.body.user_id;
  sqlph = "UPDATE Parameter_settings_for_user set abnormal_threshold_days = " + req.body.ph_parameter + " WHERE parameter_id = 2 and user_id = " + user_id;
  sqlglucose = "UPDATE Parameter_settings_for_user set abnormal_threshold_days ="+ req.body.glucose_parameter + " WHERE parameter_id = 1 and user_id = " + user_id;
  console.log(sqlph);
  console.log(sqlglucose);
  connection.query(sqlph, function(err, success, fields) {
    if (err) throw err;
    console.log ;
  });
  connection.query(sqlglucose, function(err, success, fields) {
    if (err) throw err;
    console.log ;
  });

});

settingRouter.route('/settings/:id')
.get(function(req, res) {
  var user_id = req.params.id;
  console.log(user_id);
  console.log("in the get settings");
  sql = "SELECT abnormal_threshold_days FROM User, Parameter_settings_for_user Where Parameter_settings_for_user.user_id = ? and Parameter_settings_for_user.user_id = User.user_id" ;
  connection.query(sql,[user_id], function(err, rows, fields) {
    if(err) throw err;
    console.log(rows);
    var success = {data:rows};
    res.json(success) ;
  });
});


module.exports = settingRouter;

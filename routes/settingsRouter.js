var express = require('express');
var bodyParser = require('body-parser');
var passwordHash = require('password-hash');
const nodemailer = require('nodemailer');
const hashSalt = "fjsdklrepublic0149348.,9@kfzxmn";
var appmtRouter = express.Router();
var mysql      = require('mysql');
//var connection = mysql.createConnection('mysql://b6f61539e0b3f6:1fa9e50f@us-cdbr-iron-east-04.cleardb.net/heroku_4af0ef73ab05633?reconnect=true');
// var url = process.env.CLEARDB_DATABASE_URL || 'mysql://root@localhost/mydb?reconnect=true';
// var connection = mysql.createConnection(url);

***REMOVED***
var connection = mysql.createConnection({
***REMOVED***
  user     : "sainal",
***REMOVED***
  port     : 3306,
  database : "fyp"
});



***REMOVED***

appmtRouter.use(bodyParser.json());
appmtRouter.route('/')
.post(function(req, res) {
  //console.log(req);
  // let formattedDate = req.body.appointment_date.slice(0,10);
  // console.log(formattedDate+'",'+false+','+req.body.patient_id+','+req.body.time_of_day_id+','+req.body.clinic_id+')');
  //var sql = 'insert into Appointment(appointment_date,is_request_sent,patient_id,time_of_day_id,clinic_id) values("'+formattedDate+'",'+false+','+req.body.patient_id+','+req.time_of_day_id+','+req.body.clinic_id+')';
  column = ""; value = "";
  for (item in req.body) {
    column += "," + item;
    value += "," + req.body[item];
  };
  value = value.substring(1); column = column.substring(1);
  sql = "INSERT INTO Parameter (" + column + ") VALUES (" + value + ")";
  console.log(sql);
  connection.query(sql, function(err, success, fields) {
    if (err) throw err;
    console.log(success);
  });


});



module.exports = appmtRouter;

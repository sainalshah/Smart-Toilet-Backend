var express = require('express');
var bodyParser = require('body-parser');
var passwordHash = require('password-hash');
const nodemailer = require('nodemailer');
const hashSalt = "fjsdklrepublic0149348.,9@kfzxmn";
var adviceRouter = express.Router();
var mysql      = require('mysql');
var email = require("../config/sendEmail.js");
//var connection = mysql.createConnection('mysql://b6f61539e0b3f6:1fa9e50f@us-cdbr-iron-east-04.cleardb.net/heroku_4af0ef73ab05633?reconnect=true');
// var url = process.env.CLEARDB_DATABASE_URL || 'mysql://root@localhost/mydb?reconnect=true';
// var connection = mysql.createConnection(url);

var users = require('./users.js');
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

connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database.');
});

***REMOVED***

adviceRouter.use(bodyParser.json());
adviceRouter.route('/')
.post(function(req, res) {
  //console.log(req);
  var view = false ;
  sql = 'INSERT INTO Doctor_feedback (ph_indicator, glucose_indicator, comment, patient_view, comment_date) VALUES (?,?,?,?,CONVERT_TZ(now(),"+00:00","+8:00"))';
  console.log(sql);
  console.log(req.body);

  connection.query(sql,[req.body.ph,req.body.glucose,req.body.comment,1], function(err, success, fields) {
    if (err){
      throw err;
      res.json({result:{code:0,msg:"error"}});
    };
    sqlUpdate = "Update Appointment set feedback_id = " + success.insertId + " WHERE appointment_id = ?";
    connection.query(sqlUpdate,[req.body.appointment_id], function(err, success, fields){
      if (err){
        throw err;
        res.json({result:{code:0,msg:"error"}});
        return;
      }
      else{
        var getEmailSql = "select user_email from User U, Appointment A where appointment_id=? and U.user_id=A.patient_id";
        console.log("get email sql",getEmailSql);
        connection.query(getEmailSql,[req.body.appointment_id], function (err, success, fields) {
          if(err)
          throw err;
          console.log("data from db, ",success);
          var emailoptions = {
            to:success[0].user_email,
            subject:"New Feedback",
            title:"New Feedback",
            body: `There is a new feedback posted to you. <br/> <b>${req.body.ph}</b>
            <br/><b>${req.body.glucose}</b> <br/><b>${req.body.comment}</b>`,
            url:"https://ec2-13-228-111-202.ap-southeast-1.compute.amazonaws.com/"
          };
          email(emailoptions,function (err,info) {
            if(err)
            throw err;
            console.log("email sent",info);
            res.json({result:{code:1,msg:"success"}});
          });
        });

      }
    });
  });

});

adviceRouter.route('/:id')
.get( function(req, res) {
  var IS_CONFIRMED = false ;
  //console.log("message "+id);
  var feedback_id = req.params.id;
  console.log(feedback_id);
  console.log("in the get appointment");
  //var sql = 'Select clinic_email from Clinic where clinic_id=?'   ;
  sql = "SELECT comment, name FROM Doctor_feedback, User, Appointment Where Doctor_feedback.feedback_id = " + feedback_id + " and Appointment.patient_id = User.user_id";
  connection.query(sql,[feedback_id], function(err, rows, fields) {
    if(err) throw err;
    console.log(rows);
    var success = {data:rows[0]};
    res.json(success);
  });
});
adviceRouter.route('/viewFeedback/:id')
.get(function(req, res) {
  var IS_CONFIRMED = false ;
  //console.log("message "+id);
  var user_id = req.params.id;
  console.log(user_id);
  console.log("in the get appointment");

  //var sql = 'Select clinic_email from Clinic where clinic_id=?';
sql = `SELECT ph_indicator, glucose_indicator, comment,
DATE_FORMAT(comment_date, "%Y-%m-%d  %H:%m%p") AS comment_date FROM Doctor_feedback, Appointment
Where Doctor_feedback.feedback_id = Appointment.feedback_id and Appointment.patient_id = ? ORDER BY comment_date DESC`;
  connection.query(sql,[user_id], function(err, rows, fields) {
    if(err) throw err;
    console.log(rows);
    var success = {data:rows};
    res.json(success);
  });
});

module.exports = adviceRouter;

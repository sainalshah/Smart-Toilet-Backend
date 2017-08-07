var express = require('express');
var bodyParser = require('body-parser');
var passwordHash = require('password-hash');
const hashSalt = "fjsdklrepublic0149348.,9@kfzxmn";
var appmtRouter = express.Router();
var mysql      = require('mysql');
var email = require("../config/sendEmail.js");
//var connection = mysql.createConnection('mysql://b6f61539e0b3f6:1fa9e50f@us-cdbr-iron-east-04.cleardb.net/heroku_4af0ef73ab05633?reconnect=true');
// var url = process.env.CLEARDB_DATABASE_URL || 'mysql://root@localhost/mydb?reconnect=true';
// var connection = mysql.createConnection(url);
var notifyModule = require("../config/newNotification.js");
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

appmtRouter.use(bodyParser.json());
appmtRouter.route('/')
.post( function(req, res) {
  console.log(req.body);
  let formattedDate = req.body.appointment_date.slice(0,10);
  console.log(formattedDate+'",'+false+','+req.body.patient_id+','+req.body.time_of_day_id+','+req.body.clinic_id+')');
  //var sql = 'insert into Appointment(appointment_date,is_request_sent,patient_id,time_of_day_id,clinic_id) values("'+formattedDate+'",'+false+','+req.body.patient_id+','+req.time_of_day_id+','+req.body.clinic_id+')';
  column = ""; value = "";
  for (item in req.body) {
    column += "," + item;
    if (item=="appointment_date"){
      value += ",'" + formattedDate + "'";
    }
    else {
      value += "," + req.body[item];
    }
  };
  value = value.substring(1); column = column.substring(1);
  sql = "INSERT INTO Appointment (" + column + ") VALUES (" + value + ")";
  console.log(sql);
  connection.query(sql, function(err, success, fields) {
    if (err){
      throw err;
      res.json({result:{code:0,msg:"error"}});
    };
    console.log(success);
    var value = "";
    for (item in req.body) {
      value += req.body[item];
    }
    value = hashSalt + value + success.insertId;
    var prefixLength = 5;
    hash = passwordHash.generate(value).slice(prefixLength);
    console.log(value);
    console.log("hash: "+hash);
    console.log("hashLength: "+hash.length);
    var putHash = "update Appointment set url_hash='"+hash+"' where appointment_id="+success.insertId;
    connection.query(putHash, function(err, success, fields) {
      if (err){
        res.json({result:{code:0,msg:"error"}});
        throw err;
      };
      console.log("hash value updated");

      var getEmailSql = "select clinic_email from Clinic where clinic_id=?";
      console.log("get email sql",getEmailSql);
      connection.query(getEmailSql,[req.body.clinic_id], function (err, success, fields) {
        if(err)
        throw err;
        console.log(success);
        var emailoptions = {
          to:success[0].clinic_email,
          subject:"New appointment request",
          title:"Appointment request",
          body: "There is a new appointment request. <br/>Visit the Medical Practitioner website to view the request",
          url:"https://ec2-13-228-111-202.ap-southeast-1.compute.amazonaws.com/"
        };
        email(emailoptions,function (err,info) {
          if(err)
          throw err;
          console.log("email sent",info);
          res.json({result:{code:1,msg:"success"}});
        });
      });
    });
  });
})

.put( function(req, res) {
  console.log(req.body);
  console.log("in the update appointment");
  var sql = `Update Appointment set Confirmed_appointment_date=?, appointment_time=?, is_confirmed=true where appointment_id=?`;
  connection.query(sql,[req.body.date,req.body.time,req.body.appointment_id], function(err,success, fields) {
    if(err) {

      res.json({});
      throw err
    };
    var options = {
      appointment_id:req.body.appointment_id,
      notification_type_id: 1,
      message: "Your appointment is confirmed."
    }
    notifyModule.notify(connection,options,function() {
      console.log("notification success");
    });
    var success = {success:true};
    res.json(success);
  });
});


appmtRouter.route('/:id')
.get(function(req, res) {

  var IS_CONFIRMED = false ;
  //console.log("message "+id);
  var user_id = req.params.id;
  console.log(user_id);
  console.log("in the get appointment");
  //var sql = 'Select clinic_email from Clinic where clinic_id=?'   ;
  var sql =  `Select feedback_id ,appointment_id, user_id ,name,time_of_day ,is_confirmed,appointment_date,Confirmed_appointment_date ,
DATE_FORMAT(appointment_time, "%r") as appointment_time, url_hash from User , Appointment  ,Time_of_day  where User.user_id = Appointment.patient_id and
 Time_of_day.time_id = Appointment.Time_of_day_id and Appointment.clinic_id = ?   Order by appointment_date desc ,appointment_time desc ,is_confirmed desc` ;
  connection.query(sql,[user_id], function(err, rows, fields) {
    if(err) throw err;
    console.log(rows);
    var success = {data:rows};
    res.json(success) ;
  });
});



module.exports = appmtRouter;

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
  host     : "127.0.0.1",
  user     : "testuser",
***REMOVED***
  port     : 3306,
  database : "testdb"
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
  //console.log(req);
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
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
      ***REMOVED***
      ***REMOVED***
          }
        });
        url = "http://localhost:3000/appointment/"+hash;
        console.log("url: "+url);
        // setup email data with unicode symbols
        let mailOptions = {
          from: '"SITF" <sitf.2017@gmail.com>', // sender address
          to: 'sainaledava@gmail.com', // list of receivers
          subject: 'Appointment Request', // Subject line
          html: '<h1>Appointment Request</h1>There is a new appointment request<br/>'+
          '<a href="'+url+'">Click here</a> to launch web app'// html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            res.json({result:{code:0,msg:"error"}});
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
          res.json({result:{code:1,msg:"success"}});

        });
      });
    });

  });

  appmtRouter.route('/:id')
  .get( users.isLoggedIn ,function(req, res) {

    var IS_CONFIRMED = false ;
    //console.log("message "+id);
    var user_id = req.params.id;
    console.log(user_id);
    console.log("in the get appointment");
  //var sql = 'Select clinic_email from Clinic where clinic_id=?'   ;
   var sql = 'Select user_id ,name ,is_confirmed,appointment_date ,appointment_time, url_hash from User , Appointment where User.user_id = Appointment.patient_id and Appointment.clinic_id = ? '  ;//var sql = 'Select User.name ,Appointment.appointment_date ,Appointment.appointment_time, Appointment.url_hash from  User , Appointment  where User.user_id = Appointment.patient_id  and Appointment.is_confirmed=false and Appointment.clinic_id = ? ';
    connection.query(sql,[user_id], function(err, rows, fields) {
      if(err) throw err;
      console.log(rows);
      var success = {data:rows};
      res.json(success);
    });
  });



  module.exports = appmtRouter;

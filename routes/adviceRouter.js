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
  //console.log(req);
  sql = "INSERT INTO Medical_advice (user_id,clinic_id,ph_value,things_to_do_ph,glucose_value,things_to_do_glucose,hydration_value,things_to_do_hydration,advice_datetime) VALUES (?,?,?,?,?,?,?,?,?)";
  console.log(sql);
  console.log(req.body);
  connection.query(sql,[req.body.user_id,req.body.clinic_id,req.body.ph_value,req.body.phadvice_data,req.body.glucose_value,req.body.phadvice_data,req.body.hydration_value,req.body.hydrationadvice_data,req.body.advice_datetime], function(err, success, fields) {
    if (err){
      throw err;
      res.json({result:{code:0,msg:"error"}});
    };
    res.json({result:{code:1,msg:"success"}});
  });

});



  module.exports = appmtRouter;

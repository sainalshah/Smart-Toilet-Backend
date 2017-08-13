var express = require('express');
var bodyParser = require('body-parser');
var NotificationRouter = express.Router();
var mysql      = require('mysql');

var connection = mysql.createConnection({
***REMOVED***
***REMOVED***
***REMOVED***
  port     : 3306,
  database : "fyp"
});



***REMOVED***

NotificationRouter.use(bodyParser.json());
NotificationRouter.route('/pushToken')
.put(function(req, res) {
 var user_id = req.body.user_id ;
 var pushtoken = req.body.token;
 console.log(pushtoken);
 console.log(user_id);
var sql= `UPDATE User set push_token =? where user_id=? `;
  //sql = "INSERT INTO Parameter (" + column + ") VALUES (" + value + ")";
  console.log(sql);
  connection.query(sql,[pushtoken,user_id] ,function(err, success, fields) {
    if (err) throw err;
    console.log(success);
  });
})



NotificationRouter.route('/:id')
.get(function(req, res){

  var user_id = req.params.id;
  console.log(user_id);
  console.log("in the get notifcation");
  var sql = `(Select DATE_FORMAT(Appointment.appointment_time, "%r") as appointment_time ,Clinic.clinic_name,Clinic.clinic_address,Clinic.postal_code,
  DATE_FORMAT(Appointment.Confirmed_appointment_date,'%d/%m/%Y') as appointment_date,
Notification.user_id , Notification.notification_type_id ,  Notification_type.type_description ,
 DATE_FORMAT(incident_time, "%r") as time
 FROM  Notification , Notification_type,Appointment, Clinic where Appointment.clinic_id=Clinic.clinic_id and
Notification_type.notification_type_id=Notification.notification_type_id
and Appointment.appointment_id = Notification.appointment_id and Notification.user_id= ? Order by Notification.notification_id desc Limit 15)`;
  //var sql = 'Select User.name ,Appointment.appointment_date ,Appointment.appointment_time, Appointment.url_hash from  User , Appointment  where User.user_id = Appointment.patient_id  and Appointment.is_confirmed=false and Appointment.clinic_id = ? ';
  connection.query(sql,[user_id], function(err, rows, fields) {
    if(err) throw err;
    console.log(rows);
    var success = {data:rows};
    res.json(success);

  });
});

module.exports = NotificationRouter;

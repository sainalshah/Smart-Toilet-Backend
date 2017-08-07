var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var request = require('request-promise');
//var connection = mysql.createConnection('mysql://b6f61539e0b3f6:1fa9e50f@us-cdbr-iron-east-04.cleardb.net/heroku_4af0ef73ab05633?reconnect=true');
// var url = process.env.CLEARDB_DATABASE_URL || 'mysql://root@localhost/mydb?reconnect=true';
// var connection = mysql.createConnection(url);

var users = require('./users.js');
***REMOVED***
***REMOVED***
//   host     : process.env.RDS_HOSTNAME,
//   user     : process.env.RDS_USERNAME,
//   password : process.env.RDS_PASSWORD,
//   port     : process.env.RDS_PORT,
***REMOVED***
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

router.post('/connectFb',function(req, res) {
  console.log(req.body);
  var sql = 'update User set fb_app_scope_id=? where user_id=?';
  connection.query(sql,[req.body.fb_user_id,req.body.user_id], function(err, fields) {
    if (err) throw err;
    res.json({status:0});
  });
});
function sort(clinics) {
  for (i = 0; i < clinics.length-1; i++) {
    smallestPos = i;
    for (j = i; j < clinics.length; j++) {
      if(clinics[j].distance < clinics[smallestPos].distance){
        smallestPos = j;
      }
    }
    temp = clinics[i];
    clinics[i] = clinics[smallestPos];
    clinics[smallestPos] = temp;
  }
  return clinics;
}

var distanceResultCount = 0;
function getDistance(url, clinic,index,res){
  request({
    uri: url
  }).then(body => {
    distanceResultCount++;
    var data = JSON.parse(body);
    if(data.routes[0]){
      console.log("success!!!",data.routes[0].legs[0].distance);
      newDistance = data.routes[0].legs[0].distance.value;
      // console.log(clinicGlobal);
      console.log("current iteration: ",index);
      clinic[index].distance = newDistance;
    } else {
      console.log("error finding distance\n",body);
      console.log(url);
    }
    if(distanceResultCount >= clinic.length){
      console.log("sending back data\n",clinic);
      res.json(sort(clinic));
    }
  }, (error) => {
    console.error("Unable to request distance");
    console.error(error);
  });
};

function produceShortName(clinicName) {
  MAX_ALLOWED_LENGTH = 16;
  if(clinicName.length>MAX_ALLOWED_LENGTH){
    return clinicName.substring(0, MAX_ALLOWED_LENGTH)+" ...";
  }
  return clinicName;
};
router.get('/clinic/:id',function(req, res) {
  var sql = 'SELECT * FROM Clinic';
  distanceResultCount = 0;
  //
  // var lat1 = '44.968046';   //req.body.lat1;
  // var lon1 = '-94.420307';  //req.body.lon1;
  var location = req.params.id; // id is the location
  console.log(location);
  connection.query(sql, function(err, clinic, fields) {
    if (err) throw err;
    // console.log(clinic);


    if(location){
      console.log("found lat and long", location);
      for (var i = 0; i < clinic.length; i++) {
        url = "http://maps.googleapis.com/maps/api/directions/json?origin=" +
        location+ "&destination=" + clinic[i].coordinates +"&sensor=false&units=metric&mode=driving";
        clinic[i].shortName = produceShortName(clinic[i].clinic_name);
        getDistance(url,clinic,i,res);
      }
    }
    else{
      console.log("lat and lng not send with request");
      res.json(clinic);
    }
  });

});


router.get('/scan/:id',function(req, res){
  console.log("id is ",req.params.id);
  console.log("success");
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
router.get('/patient/:id', function(req, res){
  console.log("hi");
  //console.log("message "+id);


  //console.log("message "+id);
  var user_id = req.params.id;
  console.log(user_id);
  console.log("in the get appointment");
  //var sql = 'Select clinic_email from Clinic where clinic_id=?'   ;
  var sql = 'Select name ,appointment_date ,appointment_time, url_hash from User , Appointment where User.user_id = Appointment.patient_id and Appointment.is_confirmed =true and Appointment.clinic_id = ? '  ;
  //var sql = 'Select User.name ,Appointment.appointment_date ,Appointment.appointment_time, Appointment.url_hash from  User , Appointment  where User.user_id = Appointment.patient_id  and Appointment.is_confirmed=false and Appointment.clinic_id = ? ';
  connection.query(sql,[user_id], function(err, rows, fields) {
    if(err) throw err;
    console.log(rows);
    var success = {data:rows};
    res.json(success);
  });
});


module.exports = router;

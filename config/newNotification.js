var notification = require('./notification.js');

function newNotification(connection,options,callback) {
  var sql = "INSERT INTO Notification (user_id,appointment_id,notification_type_id,incident_time)VALUES(?,?,?,now()) ";

  getUserDetails(options.appointment_id,options.user_id,connection,function (err,UserData) {
    if(!err){
      console.log(UserData.push_token);
      connection.query(sql,[UserData.user_id,options.appointment_id,options.notification_type_id], function(err, success, fields) {
        if (err) throw err;
        console.log(success);
      });
      notification([UserData.push_token],options.message,function(response){})
    }
  });
}
function getUserDetails(appointment_id,user_id,connection,callback){
  console.log("passed in appointment_id",appointment_id);
  if(appointment_id){
    var sql = `select U.user_id, U.push_token from User U, Appointment A
    where A.patient_id = U.user_id
    and A.appointment_id=?`;
    id = appointment_id;
  }
  else {
    var sql = `select U.user_id, U.push_token from User U, Appointment A
    where A.patient_id = U.user_id
    and U.user_id=?`;
    id = user_id;
  }
  console.log("sql ", sql);
  console.log("id ", id);
  connection.query(sql,[id],function (err,success,fields) {
    console.log("data is ,",success);
    if(err || success.length <= 0){
      err = "array empty or error";
      console.log(err);
      callback(err,null);
    }
    else {
      console.log("returning data ",success[0]);
      callback(null,success[0]);
    }
  });
}

module.exports = {notify: newNotification};

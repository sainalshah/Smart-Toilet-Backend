var notification = require('./notification.js');

function newNotification(connection,options,callback) {
  var sql = "INSERT INTO Notification (user_id,appointment_id,notification_type_id,incident_time)VALUES(?,?,?,?) ";
  connection.query(sql,[options.user_id,options.appointment_id,options.notification_type_id,options.incident_time], function(err, success, fields) {
    if (err) throw err;
    notification([options.token],options.message,function(response){})
    console.log(success);
  })
  }

module.exports = {notify: newNotification};

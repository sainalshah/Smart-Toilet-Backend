var mysql      = require('mysql');
var notifyModule = require("./newNotification.js");
var connection = mysql.createConnection({
  host     : "",
  user     : "",
  password : "",
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
var Worker = require("tiny-worker");

//

// var sched = later.parse.recur().every(24*60).minute(),
// t = later.setInterval(postWorkerJob, sched);
function alert() {
  checkLastScanDate();
  setInterval (postWorkerJob,24*60*1000);
}
// setInterval (postWorkerJob,60*1000); //1 minute interval
function postWorkerJob() {
  console.log(new Date());
  var worker = new Worker(function () {
    self.onmessage = function (ev) {
      postMessage(ev.data);
    };
  });

  worker.onmessage = function (ev) {
    console.log(ev.data);
    checkLastScanDate();
    worker.terminate();
  };
  worker.postMessage("Hello World!");
}
function sendAlert(user_id){
  checkSql = `SELECT SA.isNormal, COUNT(SA.isNormal) AS 'Count'
  FROM  Scan_result SR, Scan_analysis SA, Parameter_has_scan_result PSR
  WHERE SR.patient_id = 2
  AND SR.result_id = PSR.result_id
  AND PSR.analysis_id = SA.analysis_id
  AND DATEDIFF(CURDATE(),SR.scan_date) < 4
GROUP BY SA.isNormal`;
  connection.query(checkSql,[user_id], function(err,analysis, fields) {
    if(err){
      throw err;
    }
    console.log(analysis);
    normalCount = 0;
    abnormalCount = 0;
    if(analysis[0]){
      if(analysis[0].isNormal == 1){
        normalCount = analysis[0].Count;
      } else {
        abnormalCount = analysis[0].Count;
      }
    }
    if(analysis[1]){
      if(analysis[1].isNormal == 1){
        normalCount = analysis[1].Count;
      } else {
        abnormalCount = analysis[1].Count;
      }
    }
    console.log("counts: ",abnormalCount,normalCount);
    if(abnormalCount > normalCount){
      var options = {
        user_id:user_id,
        notification_type_id: 3,
        message: "Your scan analysis has been abnormal for last three days"
      }
      notifyModule.notify(connection,options,function() {
        console.log("notification success");
      });
    }
  });
}
function checkLastScanDate() {
  var sql = "select * from User";

  connection.query(sql, function(err,users, fields) {
    if(err){
      throw err;
    }
    console.log(users);
    console.log("in the check last scan data ");
    for (user of users) {
      sendAlert(user.user_id);
    }
  });
}



module.exports = alert;

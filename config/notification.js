var request = require("request");

function sendNotification(tokens ,message , callback){

var options = {
  method: 'POST',
  url: 'https://api.ionic.io/push/notifications',
  headers: {
    'Authorization': 'Bearer ' + securitytoken,
    'Content-Type': 'application/json'
  },
  json: {
    "tokens": tokens,
    "profile": "gfc",
    "notification": {
        "message": message
    }
}
};

request(options, function(err, response, body) {
  if (err) throw new Error(err);
  console.log(body);

  callback(response);
});
}
// sendNotification([],"",function(response){
//   console.log(response);
***REMOVED***

module.exports=sendNotification;

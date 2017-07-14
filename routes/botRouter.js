var express = require('express');
var bodyParser = require('body-parser');
var passwordHash = require('password-hash');
const nodemailer = require('nodemailer');
const hashSalt = "fjsdklrepublic0149348.,9@kfzxmn";
var chatBotRouter = express.Router();
var mysql      = require('mysql');
var request = require('request-promise');
***REMOVED***
***REMOVED***
var later = require('later');
var users = require('./users.js');
***REMOVED***
var connection = mysql.createConnection({
***REMOVED***
  user     : "sainal",
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
var Worker = require("tiny-worker");



var sched = later.parse.recur().every(24*60).minute(),
t = later.setInterval(postWorkerJob, sched);

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
function checkLastScanDate() {
  console.log("in the check last scan data ")
  checkSql = `select U.name, U.fb_page_scope_id
  from Scan_result SR, User U
  where DATEDIFF(CURDATE(),SR.scan_date) > 2
  and SR.patient_id=U.user_id
  and U.fb_page_scope_id is not null`;
  connection.query(checkSql, function(err,users, fields) {
    console.log(users);
    sendReminderMessage(users);
  });
}
function sendReminderMessage(users) {
  console.log("in the send reminder");
  if(users){
    for(user of users){
      sendMessengerTextMessage(user.fb_page_scope_id, `Hi ${user.name}, We have detected that you never scan for last 3 days`);
    }
  }
}
***REMOVED***
function checkSignature(req) {
  return (req.isXHub && req.isXHubValid());
}

function sendMessengerResponse(messageData) {
  return request({
    uri: 'https://graph.facebook.com/v2.9/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData
  }).then(body => {
    var recipientId = body.recipient_id;
    var messageId = body.message_id;

    console.log('Successfully sent message with id %s to recipient %s',
    messageId, recipientId);
  }, (error) => {
    console.error("Unable to send message.");
    console.error(error);
  });
}
function sendMessengerTextMessage(recipientId, messageText) {
  return sendMessengerResponse({
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  });
}
function checkSenderSubscription(sender_page_id){
  checkSql = "select * from User where fb_page_scope_id=?";
  connection.query(checkSql,[sender_page_id], function(err,user, fields) {
    console.log(user);
    if(!user.length){
      console.log("sender not subscribed to chatbot")
      trySubscribeSender(sender_page_id);
    }
    else{
      console.log("sender is alr subscribed");
    }
  });
}
function trySubscribeSender(sender_page_id){ // will subscribe only if the corresponding app scoped id is present
  return request({
    uri: `https://graph.facebook.com/v2.9/${sender_page_id}?fields=ids_for_apps`,
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'GET'
  }).then(body => {
    sender_app_id = JSON.parse(body).ids_for_apps.data[0].id;
    console.log("the id extracted is ", sender_app_id);
    checkSql = "select * from User where fb_app_scope_id=?";
    connection.query(checkSql,[sender_app_id], function(err,user, fields) {
      if (err) throw err;
      console.log(user);
      if (user.length>0 && !user[0].fb_page_scope_id){
        console.log("user connected to facebook, but first time msgg bot");
        var sql = 'update User set fb_page_scope_id=? where fb_app_scope_id=?';
        connection.query(sql,[sender_page_id,sender_app_id], function(err, fields) {
          if (err) throw err;
          console.log("successs updating page scope id!!!");
        });
      }
    });
  }, (error) => {
    console.error("Unable to send message.");
    console.error(error);
  });
}
chatBotRouter.use(bodyParser.json());
chatBotRouter.route('/test')
.get(function(req, res, next) {
  const options = {
    method: 'GET',
    uri: `https://graph.facebook.com/v2.9/${req.params.id}`,
    qs: {
      access_token: user_access_token,
      fields: userFieldSet
    }
  };
  request(options)
  .then(fbRes => {
    res.json(fbRes);
  })
});
chatBotRouter.route('/')
.get(function(req, res, next) {
  if (req.query['hub.mode'] === 'subscribe' &&
  req.query['hub.verify_token'] === 'mydearkuttichathan') {
    res.status(200).send(req.query['hub.challenge']);
    console.log("success");
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
})
.post(function(req, res, next) {
  // Check the signature
  console.log("in the post function");
  if (checkSignature(req)) {
    var data = req.body;

    // Make sure this is a page subscription
    if (data.object === 'page') {

      data.entry.forEach(function(entry) {
        var pageId = entry.id;
        var timeOfEvent = entry.time;

        entry.messaging.forEach(function(event) {
          if (event.message) {
            // Handle the message
            checkSenderSubscription(event.sender.id);
            sendMessengerTextMessage(event.sender.id, event.message.text);
          } else {

          }
        });
      });

      res.sendStatus(200);
    }
  } else {
    res.status(403).end();
  }


});



module.exports = chatBotRouter;

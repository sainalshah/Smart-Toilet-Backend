
const nodemailer = require('nodemailer');

function sendMail(options,callback) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    }
  });
  // setup email data with unicode symbols
  let mailOptions = {
    from: '"SITF" <sitf.2017@gmail.com>', // sender address
    to: options.to, // list of receivers
    subject: options.subject, // Subject line
    html: `<h1>${options.title}</h1>${options.body}<br/>
    <a href="${options.url}">Click here</a> to launch web app`// html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      callback(error,null);
    }
    // console.log('Message %s sent: %s', info.messageId, info.response);
    else{
      callback(null,info);
    }

  });
}

module.exports = sendMail;

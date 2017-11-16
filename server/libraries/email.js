const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  // host: 'smtp.forviz.com',
  // port: 587,
  // secure: false, // secure:true for port 465, secure:false for port 587
  service: 'gmail',
  auth: {
    user: 'sosersasad@gmail.com',
    pass: 'jokerboso',
  },
});

module.exports = function(params) {
  this.send = function() {
    const options = {
      from: '"PropShop" <propshop@gmail.com>',
      to: params.to,
      subject: params.subject,
      html: params.html,
    };
    if (params.replyTo) options.replyTo = params.replyTo;
    transporter.sendMail(options, function(err, suc) {
      err ? params.errorCallback(err) : params.successCallback(suc);
    });
  };
};

const nodeMailer = require("nodemailer");
exports.sendEmail = emailData  => {
  const transporter = nodeMailer.createTransport({
    host:process.env.EMAIL_HOST,
    port: 465, 
    secure: true, 
    auth: {
      user:process.env.EMAIL_USER, // your domain email address
      pass:process.env.EMAIL_PASS, // your password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  transporter.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });
 
  return transporter.sendMail(emailData).then(info => {
      console.log(`Message sent: ${info.response}`);
      console.log("response from the server")
      return info
    }).catch(err => {
      console.log(`Problem sending email: ${err}`)
      console.log("catch error here")
      return err;
    });

};

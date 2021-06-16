"use strict";

const nodeMailer = require("nodemailer");
exports.sendEmail = emailData  => {
    //let testAccount = await nodemailer.createTestAccount();
    nodeMailer.createTestAccount((er, testAccount)=>{
      console.log({er, testAccount})

      const transporter = nodeMailer.createTransport({
        //host: 'mail.nsst.com.ng',
        host: "mail.nsst.com.ng",
        port: 578, //578
        secure: false, // true for 465, false for other ports
        debug:true,
        //pool: true,
        logger:true,
        //direct: true,
        auth: {
          user: 'dev@nsst.com.ng', // your domain email address
          pass: 'developer@2021_', // your password
          //user: testAccount.user, // generated ethereal user
          //pass: testAccount.pass, // generated ethereal password
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
   
    return transporter
        .sendMail(emailData)
        .then(info => {
            console.log(`Message sent: ${info.response}`);
            console.log("response from the server")
            return info
        })
        .catch(err => {
            console.log(`Problem sending email: ${err}`)
            console.log("catch error here")
            return err;
        });
    })
  
};

/*
// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
 // const transporter = nodeMailer.createTransport({})
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);
*/


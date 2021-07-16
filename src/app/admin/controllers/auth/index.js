const jwt = require("jsonwebtoken");
const expressJWT = require('express-jwt');
const _ = require("lodash");
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();
import * as models from '../../../../models'

const {sendEmail} = require("../../midleware/helper")


exports.signin = async (req, res)=>{
    const {email, password} = req.body;

    /* #swagger.tags = ['Auth-Admin']
      #swagger.description = 'Endpoint allow admin to signin' 
  
        #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Admin Sign',
        required: true,
        type: 'object',
        schema: {
                    "email": "admin@gmail.com",
                    $password: "password_demo_123"
                }
       } 
    */
   
    
   const isAdmin = await  models.Admin.findOne({email});
   if(!isAdmin){
        /* #swagger.responses[404] = {
                description: "user not found",
                schema: { 
                    "error ":"invalid email address",
                 }
            } 
        */
       return res.status(404).json({error:"Invalid email address"})
    }
    const user = await isAdmin.authenticate(password);
    if(!user){
        /* #swagger.responses[405] = {
                description: "Password error",
                schema: { 
                    "error ":"email and Password not match, incorrect password",
                 }
            } 
        */
       return res.status(405).json({error:"email and Password not match, incorrect password "})
    }
     // generate a token with user id and secret
     const token = jwt.sign(
        { _id: user._id, role:"superAdmin" },
        process.env.JWT_SECRET
    );
  
    res.cookie("t", token, { expire: new Date() + 9999 });

    /* #swagger.responses[200] = {
                description: "Admin successfully login",
                schema: { 
                    "message":"adminsuccessfully login",
                    "data":{
                        "token":"token",
                        "admin":{
                            "_id":"0030303",
                            "email":"admin@gmail.com",
                            "First Name":"ade",
                            "Last Name":"Yemi",
                        }
                    }
                 }
            } 
        */
    return res.json({ token, admin: isAdmin });
}

exports.forgetPassword = async (req, res)=>{
    /*
      #swagger.tags = ['Auth-Admin']
      #swagger.description = 'Endpoint to request for password reset token' 
  
        #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Password reset token',
        required: true,
        type: 'object',
        schema: {
             $email: "admin@gmail",
        }
      }  
    */
   const { email} = req.body;
    models.Admin.findOne({email}, (err, admin)=>{
       if(err || !admin){
            /* 
                #swagger.responses[404] = {
                    description: "Invalid email",
                    schema: { 
                        error:"invalid email",
                    }
                } 
            */
           return res.status(404).json({error:"invalid email"});
        }
        const updatedFields = {resetToken:uuidv4()};
        admin = _.extend(admin, updatedFields);
        admin.save((er, result)=>{
            //console.log({er, result})
            if(er || !result){
                /**
                     * docs here
                */
                return res.status(407).json({error:"error in reseting password", er})
            }
          
            const forgetEmail = {
                from : "noreply@iemis.org",
                to:admin.email,
                subject: "Forget Password | Request for Reset token",
                html:`<!DOCTYPE html>
                <html lang="en">
                <head>
                
                  <meta charset="utf-8">
                  <meta http-equiv="x-ua-compatible" content="ie=edge">
                  <title>Admin | Password Reset Request</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style type="text/css">
                  /**
                   * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
                   */
                  @media screen {
                    @font-face {
                      font-family: 'Source Sans Pro';
                      font-style: normal;
                      font-weight: 400;
                      src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
                    }
                
                    @font-face {
                      font-family: 'Source Sans Pro';
                      font-style: normal;
                      font-weight: 700;
                      src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
                    }
                  }
                
                  /**
                   * Avoid browser level font resizing.
                   * 1. Windows Mobile
                   * 2. iOS / OSX
                   */
                  body,
                  table,
                  td,
                  a {
                    -ms-text-size-adjust: 100%; /* 1 */
                    -webkit-text-size-adjust: 100%; /* 2 */
                  }
                
                  /**
                   * Remove extra space added to tables and cells in Outlook.
                   */
                  table,
                  td {
                    mso-table-rspace: 0pt;
                    mso-table-lspace: 0pt;
                  }
                
                  /**
                   * Better fluid images in Internet Explorer.
                   */
                  img {
                    -ms-interpolation-mode: bicubic;
                  }
                
                  /**
                   * Remove blue links for iOS devices.
                   */
                  a[x-apple-data-detectors] {
                    font-family: inherit !important;
                    font-size: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                    color: inherit !important;
                    text-decoration: none !important;
                  }
                
                  /**
                   * Fix centering issues in Android 4.4.
                   */
                  div[style*="margin: 16px 0;"] {
                    margin: 0 !important;
                  }
                
                  body {
                    width: 100% !important;
                    height: 100% !important;
                    padding: 0 !important;
                    margin: 0 !important;
                  }
                
                  /**
                   * Collapse table borders to avoid space between cells.
                   */
                  table {
                    border-collapse: collapse !important;
                  }
                
                  a {
                    color: #1a82e2;
                  }
                
                  img {
                    height: auto;
                    line-height: 100%;
                    text-decoration: none;
                    border: 0;
                    outline: none;
                  }
                  </style>
                
                </head>
                <body style="background-color: #e9ecef;">
                
                  <!-- start preheader -->
                  <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
                     IEMIS password reset request  👻!!!
                  </div>
                  <!-- end preheader -->
                
                  <!-- start body -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                
                    <!-- start logo -->
                    <tr>
                      <td align="center" bgcolor="#e9ecef">
                        <!--[if (gte mso 9)|(IE)]>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                        <tr>
                        <td align="center" valign="top" width="600">
                        <![endif]-->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                          <tr>
                            <td align="center" valign="top" style="padding: 36px 24px;">
                              <a href="${process.env.SITE_URI}" target="_blank" style="display: inline-block;">
                                <img src="${process.env.SITE_URI}/logo.png" alt="Logo" border="0" width="48" style="display: block; width: 48px; max-width: 48px; min-width: 48px;">
                              </a>
                            </td>
                          </tr>
                        </table>
                        <!--[if (gte mso 9)|(IE)]>
                        </td>
                        </tr>
                        </table>
                        <![endif]-->
                      </td>
                    </tr>
                    <!-- end logo -->
                
                    <!-- start hero -->
                    <tr>
                      <td align="center" bgcolor="#e9ecef">
                        <!--[if (gte mso 9)|(IE)]>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                        <tr>
                        <td align="center" valign="top" width="600">
                        <![endif]-->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                          <tr>
                            <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                              <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Reset Your Password</h1>
                            </td>
                          </tr>
                        </table>
                        <!--[if (gte mso 9)|(IE)]>
                        </td>
                        </tr>
                        </table>
                        <![endif]-->
                      </td>
                    </tr>
                    <!-- end hero -->
                
                    <!-- start copy block -->
                    <tr>
                      <td align="center" bgcolor="#e9ecef">
                        <!--[if (gte mso 9)|(IE)]>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                        <tr>
                        <td align="center" valign="top" width="600">
                        <![endif]-->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                
                          <!-- start copy -->
                          <tr>
                            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                              <p style="margin: 0;">Tap the button below to reset your customer account password. If you didn't request a new password, you can safely delete this email.</p>
                            </td>
                          </tr>
                          <!-- end copy -->
                
                          <!-- start button -->
                          <tr>
                            <td align="left" bgcolor="#ffffff">
                              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                  <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                                    <table border="0" cellpadding="0" cellspacing="0">
                                      <tr>
                                        <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                                          <a href="${process.env.SITE_URI}/auth/admin/reset/${admin.resetToken}"  target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Reset Password</a>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <!-- end button -->
                
                          <!-- start copy -->
                          <tr>
                            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                              <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                              <p style="margin: 0;"><a href="${process.env.SITE_URI}/auth/admin/reset/${admin.resetToken}" target="_blank"> ${process.env.SITE_URI}/auth/admin/reset/${admin.resetToken} </a></p>
                            </td>
                          </tr>
                          <!-- end copy -->
                
                          <!-- start copy -->
                          <tr>
                            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                              <p style="margin: 0;">Cheers,<br> IEMIS Team</p>
                            </td>
                          </tr>
                          <!-- end copy -->
                
                        </table>
                        <!--[if (gte mso 9)|(IE)]>
                        </td>
                        </tr>
                        </table>
                        <![endif]-->
                      </td>
                    </tr>
                    <!-- end copy block -->
                
                    <!-- start footer -->
                    <tr>
                      <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
                        <!--[if (gte mso 9)|(IE)]>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                        <tr>
                        <td align="center" valign="top" width="600">
                        <![endif]-->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                
                          <!-- start permission -->
                          <tr>
                            <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                              <p style="margin: 0;">You received this email because we received a request for [type_of_action] for your account. If you didn't request [type_of_action] you can safely delete this email.</p>
                            </td>
                          </tr>
                          <!-- end permission -->
                
                          <!-- start unsubscribe -->
                          <tr>
                            <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                              <p style="margin: 0;">To stop receiving these emails, you can <a href=${process.env.SITE_URI} target="_blank">unsubscribe</a> at any time.</p>
                              <p style="margin: 0;">Lagos, Nigeria</p>
                            </td>
                          </tr>
                          <!-- end unsubscribe -->
                
                        </table>
                        <!--[if (gte mso 9)|(IE)]>
                        </td>
                        </tr>
                        </table>
                        <![endif]-->
                      </td>
                    </tr>
                    <!-- end footer -->
                
                  </table>
                  <!-- end body -->
                
                </body>
                </html>`
            }

            sendEmail(forgetEmail);
            
            /* #swagger.responses[200] = {
                    description: "sending email contain password reset token",
                    schema: { 
                        message:"email send successfully send",
                    }
                } 
            */
    
      
                res.status(200).json({message:`Dear ${result.firstName} password reset request is successful, check your email for details`, result})
            })
   })
}


exports.resetPassword = async (req, res)=>{
     /*
      #swagger.tags = ['Auth-Admin']
      #swagger.description = 'Endpoint reset password' 
  
        #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Password reset',
        required: true,
        type: 'object',
        schema: {
             $email: "admin@gmail",
             $resetToken: "011273Vb",
             $password: "011273Vb",
             $passwordConfirmation: "011273Vb",
        }
      } 
    */
   const { resetToken,password, passwordConfirmation} = req.body;
    models.Admin.findOne({resetToken}, (err, admin)=>{
      if(err || !admin){
           /* #swagger.responses[404] = {
               description: "Invalid ",
               schema: { 
                   error:"user not found",
                }
           } 
           */
          return res.status(404).json({error:"Invalid token"});
       }
       if(admin.resetToken !== resetToken){
           /* #swagger.responses[405] = {
               description: "Invalid token",
               schema: { 
                   error:"invalid reset token",
                }
           } 
           */
           return res.status(405).json({error:"invalid reset token"});
        }
        if(password !== passwordConfirmation){
            /* #swagger.responses[406] = {
                description: "Password error",
                schema: { 
                    error:"Password must match each other",
                 }
            } 
            */
            return res.status(406).json({error:"Password must match each other"});
        }
       /**
        * send email notification to the parents 
       */

       /*
        #swagger.responses[200] = {
            description: "reset password",
            schema: { 
                message:"password successfully reset, you can now login",
            }
        } 
       */

      const updatedFields = {resetToken:'',password};
      admin = _.extend(admin, updatedFields);
      admin.save((er, result)=>{
          if(er || !result){
              /**
               * docs here
               */
              return res.status(407).json({error:"error in reseting password", er})
          }

          const resetEmail = {
            from : "noreply@iemis.org",
            to:admin.email,
            subject: "Password Reset",
            html:`<!DOCTYPE html>
            <html lang="en">
            <head>
            
              <meta charset="utf-8">
              <meta http-equiv="x-ua-compatible" content="ie=edge">
              <title>Admin | Password successfully Reset</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style type="text/css">
              /**
               * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
               */
              @media screen {
                @font-face {
                  font-family: 'Source Sans Pro';
                  font-style: normal;
                  font-weight: 400;
                  src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
                }
            
                @font-face {
                  font-family: 'Source Sans Pro';
                  font-style: normal;
                  font-weight: 700;
                  src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
                }
              }
            
              /**
               * Avoid browser level font resizing.
               * 1. Windows Mobile
               * 2. iOS / OSX
               */
              body,
              table,
              td,
              a {
                -ms-text-size-adjust: 100%; /* 1 */
                -webkit-text-size-adjust: 100%; /* 2 */
              }
            
              /**
               * Remove extra space added to tables and cells in Outlook.
               */
              table,
              td {
                mso-table-rspace: 0pt;
                mso-table-lspace: 0pt;
              }
            
              /**
               * Better fluid images in Internet Explorer.
               */
              img {
                -ms-interpolation-mode: bicubic;
              }
            
              /**
               * Remove blue links for iOS devices.
               */
              a[x-apple-data-detectors] {
                font-family: inherit !important;
                font-size: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
                color: inherit !important;
                text-decoration: none !important;
              }
            
              /**
               * Fix centering issues in Android 4.4.
               */
              div[style*="margin: 16px 0;"] {
                margin: 0 !important;
              }
            
              body {
                width: 100% !important;
                height: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
              }
            
              /**
               * Collapse table borders to avoid space between cells.
               */
              table {
                border-collapse: collapse !important;
              }
            
              a {
                color: #1a82e2;
              }
            
              img {
                height: auto;
                line-height: 100%;
                text-decoration: none;
                border: 0;
                outline: none;
              }
              </style>
            
            </head>
            <body style="background-color: #e9ecef;">
            
              <!-- start preheader -->
              <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
                 IEMIS password successfully reset  👻!!!
              </div>
              <!-- end preheader -->
            
              <!-- start body -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
            
                <!-- start logo -->
                <tr>
                  <td align="center" bgcolor="#e9ecef">
                    <!--[if (gte mso 9)|(IE)]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                    <tr>
                    <td align="center" valign="top" width="600">
                    <![endif]-->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                      <tr>
                        <td align="center" valign="top" style="padding: 36px 24px;">
                          <a href="${process.env.SITE_URI}" target="_blank" style="display: inline-block;">
                            <img src="${process.env.SITE_URI}/logo.png" alt="Logo" border="0" width="48" style="display: block; width: 48px; max-width: 48px; min-width: 48px;">
                          </a>
                        </td>
                      </tr>
                    </table>
                    <!--[if (gte mso 9)|(IE)]>
                    </td>
                    </tr>
                    </table>
                    <![endif]-->
                  </td>
                </tr>
                <!-- end logo -->
            
                <!-- start hero -->
                <tr>
                  <td align="center" bgcolor="#e9ecef">
                    <!--[if (gte mso 9)|(IE)]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                    <tr>
                    <td align="center" valign="top" width="600">
                    <![endif]-->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                      <tr>
                        <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                          <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Password Reset notification</h1>
                        </td>
                      </tr>
                    </table>
                    <!--[if (gte mso 9)|(IE)]>
                    </td>
                    </tr>
                    </table>
                    <![endif]-->
                  </td>
                </tr>
                <!-- end hero -->
            
                <!-- start copy block -->
                <tr>
                  <td align="center" bgcolor="#e9ecef">
                    <!--[if (gte mso 9)|(IE)]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                    <tr>
                    <td align="center" valign="top" width="600">
                    <![endif]-->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
            
                      <!-- start copy -->
                      <tr>
                        <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                          <p style="margin: 0;">Dear ${admin.firstName},you have successfully reset your password with your account with email id ${admin.email}, <br /> If you are not perform this action on your account kindly conatct IEMIS support by click on the email below.</p>
                        </td>
                      </tr>
                      <!-- end copy -->
            
                      <!-- start button -->
                      <tr>
                        <td align="left" bgcolor="#ffffff">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                                <table border="0" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                                      <a href="mailto:hamasoasis84@gmail.com"  target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Contact us</a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <!-- end button -->
            
                      <!-- start copy -->
                      <tr>
                        <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                          <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                          <p style="margin: 0;"><a href="mailto:hamasoasis84@gmail.com" target="_blank"> hamasoasis84@gmail.com </a></p>
                        </td>
                      </tr>
                      <!-- end copy -->
            
                      <!-- start copy -->
                      <tr>
                        <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                          <p style="margin: 0;">Cheers,<br> IEMIS Team</p>
                        </td>
                      </tr>
                      <!-- end copy -->
            
                    </table>
                    <!--[if (gte mso 9)|(IE)]>
                    </td>
                    </tr>
                    </table>
                    <![endif]-->
                  </td>
                </tr>
                <!-- end copy block -->
            
                <!-- start footer -->
                <tr>
                  <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
                    <!--[if (gte mso 9)|(IE)]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                    <tr>
                    <td align="center" valign="top" width="600">
                    <![endif]-->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
            
                      <!-- start permission -->
                      <tr>
                        <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                          <p style="margin: 0;">You received this email because we received a request for [type_of_action] for your account. If you didn't request [type_of_action] you can safely delete this email.</p>
                        </td>
                      </tr>
                      <!-- end permission -->
            
                      <!-- start unsubscribe -->
                      <tr>
                        <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                          <p style="margin: 0;">To stop receiving these emails, you can <a href=${process.env.SITE_URI} target="_blank">unsubscribe</a> at any time.</p>
                          <p style="margin: 0;">Lagos, Nigeria</p>
                        </td>
                      </tr>
                      <!-- end unsubscribe -->
            
                    </table>
                    <!--[if (gte mso 9)|(IE)]>
                    </td>
                    </tr>
                    </table>
                    <![endif]-->
                  </td>
                </tr>
                <!-- end footer -->
            
              </table>
              <!-- end body -->
            
            </body>
            </html>`,
          }

          sendEmail(resetEmail)
          /**
           * to do 
           * ++++++
           * email notifications here
           */

          res.status(200).json({message:`Dear ${result.firstName} password reset successful, you can now login`, admin})
      })  
    })
}







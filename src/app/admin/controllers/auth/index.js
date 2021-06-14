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
        //console.log({admin, updatedFields})
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
                <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en"><head>
                  <title> Welcome to Coded Mails </title>
                  <!--[if !mso]><!-- -->
                  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                  <!--<![endif]-->
                  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1" />
                  <style type="text/css">
                    #outlook a {
                      padding: 0;
                    }
                
                    body {
                      margin: 0;
                      padding: 0;
                      -webkit-text-size-adjust: 100%;
                      -ms-text-size-adjust: 100%;
                    }
                
                    table,
                    td {
                      border-collapse: collapse;
                      mso-table-lspace: 0pt;
                      mso-table-rspace: 0pt;
                    }
                
                    img {
                      border: 0;
                      height: auto;
                      line-height: 100%;
                      outline: none;
                      text-decoration: none;
                      -ms-interpolation-mode: bicubic;
                    }
                
                    p {
                      display: block;
                      margin: 13px 0;
                    }
                  </style>
                  <!--[if mso]>
                        <xml>
                        <o:OfficeDocumentSettings>
                          <o:AllowPNG/>
                          <o:PixelsPerInch>96</o:PixelsPerInch>
                        </o:OfficeDocumentSettings>
                        </xml>
                        <![endif]-->
                  <!--[if lte mso 11]>
                        <style type="text/css">
                          .mj-outlook-group-fix { width:100% !important; }
                        </style>
                        <![endif]-->
                  <!--[if !mso]><!-->
                  <link href="https://fonts.googleapis.com/css2?family=Alata&amp;display=swap" rel="stylesheet" type="text/css" />
                  <style type="text/css">
                    @import url(https://fonts.googleapis.com/css2?family=Alata&amp;display=swap);
                  </style>
                  <!--<![endif]-->
                  <style type="text/css">
                    @media only screen and (min-width:480px) {
                      .mj-column-per-50 {
                        width: 50% !important;
                        max-width: 50%;
                      }
                
                      .mj-column-per-100 {
                        width: 100% !important;
                        max-width: 100%;
                      }
                    }
                  </style>
                  <style type="text/css">
                    @media only screen and (max-width:480px) {
                      table.mj-full-width-mobile {
                        width: 100% !important;
                      }
                
                      td.mj-full-width-mobile {
                        width: auto !important;
                      }
                    }
                  </style>
                  <style type="text/css">
                    a,
                    span,
                    td,
                    th {
                      -webkit-font-smoothing: antialiased !important;
                      -moz-osx-font-smoothing: grayscale !important;
                    }
                
                    .hover:hover td,
                    .hover:hover p,
                    .hover:hover a {
                      background-color: #d9433a !important;
                    }
                  </style>
                </head>
                
                <body style="background-color:#ffffff;" data-new-gr-c-s-check-loaded="8.876.0" data-gr-ext-installed="">
                  <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;"> Preview - Welcome to Coded Mails </div>
                  <div style="background-color:#ffffff;">
                    <!--[if mso | IE]>
                      <table
                         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
                      >
                        <tr>
                          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                      <![endif]-->
                    <div style="margin:0px auto;max-width:600px;">
                      <table role="presentation" style="width:100%;" cellspacing="0" cellpadding="0" border="0" align="center">
                        <tbody>
                          <tr>
                            <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;text-align:center;">
                              <!--[if mso | IE]>
                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                
                        <tr>
                      
                            <td
                               class="" style="vertical-align:middle;width:300px;"
                            >
                          <![endif]-->
                              <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                                <table role="presentation" style="vertical-align:middle;" width="100%" cellspacing="0" cellpadding="0" border="0">
                                  <tbody><tr>
                                    <td style="font-size:0px;padding:10px 25px;word-break:break-word;" align="left">
                                      <table role="presentation" style="border-collapse:collapse;border-spacing:0px;" cellspacing="0" cellpadding="0" border="0">
                                        <tbody>
                                          <tr>
                                            <td style="width:150px;">
                                              <img alt="image description" src="https://codedmails.com/images/logo-black.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:14px;" width="150" height="auto" />
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody></table>
                              </div>
                              <!--[if mso | IE]>
                            </td>
                          
                            <td
                               class="" style="vertical-align:middle;width:300px;"
                            >
                          <![endif]-->
                              <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                                <table role="presentation" style="vertical-align:middle;" width="100%" cellspacing="0" cellpadding="0" border="0">
                                  <tbody><tr>
                                    <td style="font-size:0px;padding:10px 25px;word-break:break-word;" align="right">
                                      <!--[if mso | IE]>
                      <table
                         align="right" border="0" cellpadding="0" cellspacing="0" role="presentation"
                      >
                        <tr>
                      
                              <td>
                            <![endif]-->
                                      <table role="presentation" style="float:none;display:inline-table;" cellspacing="0" cellpadding="0" border="0" align="right">
                                        <tbody><tr>
                                          <td style="padding:4px;">
                                            <table role="presentation" style="border-radius:3px;width:18px;" cellspacing="0" cellpadding="0" border="0">
                                              <tbody><tr>
                                                <td style="font-size:0;height:18px;vertical-align:middle;width:18px;">
                                                  <a href="#" target="_blank" style="color: #ea4a40; text-decoration: none;">
                                                    <img alt="twitter-logo" src="https://codedmails.com/images/social/black/twitter-logo-transparent-black.png" style="border-radius:3px;display:block;" width="18" height="18" />
                                                  </a>
                                                </td>
                                              </tr>
                                            </tbody></table>
                                          </td>
                                        </tr>
                                      </tbody></table>
                                      <!--[if mso | IE]>
                              </td>
                            
                              <td>
                            <![endif]-->
                                      <table role="presentation" style="float:none;display:inline-table;" cellspacing="0" cellpadding="0" border="0" align="right">
                                        <tbody><tr>
                                          <td style="padding:4px;">
                                            <table role="presentation" style="border-radius:3px;width:18px;" cellspacing="0" cellpadding="0" border="0">
                                              <tbody><tr>
                                                <td style="font-size:0;height:18px;vertical-align:middle;width:18px;">
                                                  <a href="#" target="_blank" style="color: #ea4a40; text-decoration: none;">
                                                    <img alt="facebook-logo" src="https://codedmails.com/images/social/black/facebook-logo-transparent-black.png" style="border-radius:3px;display:block;" width="18" height="18" />
                                                  </a>
                                                </td>
                                              </tr>
                                            </tbody></table>
                                          </td>
                                        </tr>
                                      </tbody></table>
                                      <!--[if mso | IE]>
                              </td>
                            
                              <td>
                            <![endif]-->
                                      <table role="presentation" style="float:none;display:inline-table;" cellspacing="0" cellpadding="0" border="0" align="right">
                                        <tbody><tr>
                                          <td style="padding:4px;">
                                            <table role="presentation" style="border-radius:3px;width:18px;" cellspacing="0" cellpadding="0" border="0">
                                              <tbody><tr>
                                                <td style="font-size:0;height:18px;vertical-align:middle;width:18px;">
                                                  <a href="#" target="_blank" style="color: #ea4a40; text-decoration: none;">
                                                    <img alt="instagram-logo" src="https://codedmails.com/images/social/black/instagram-logo-transparent-black.png" style="border-radius:3px;display:block;" width="18" height="18" />
                                                  </a>
                                                </td>
                                              </tr>
                                            </tbody></table>
                                          </td>
                                        </tr>
                                      </tbody></table>
                                      <!--[if mso | IE]>
                              </td>
                            
                              <td>
                            <![endif]-->
                                      <table role="presentation" style="float:none;display:inline-table;" cellspacing="0" cellpadding="0" border="0" align="right">
                                        <tbody><tr>
                                          <td style="padding:4px;">
                                            <table role="presentation" style="border-radius:3px;width:18px;" cellspacing="0" cellpadding="0" border="0">
                                              <tbody><tr>
                                                <td style="font-size:0;height:18px;vertical-align:middle;width:18px;">
                                                  <a href="#" target="_blank" style="color: #ea4a40; text-decoration: none;">
                                                    <img alt="instagram-logo" src="https://codedmails.com/images/social/black/linkedin-logo-transparent-black.png" style="border-radius:3px;display:block;" width="18" height="18" />
                                                  </a>
                                                </td>
                                              </tr>
                                            </tbody></table>
                                          </td>
                                        </tr>
                                      </tbody></table>
                                      <!--[if mso | IE]>
                              </td>
                            
                          </tr>
                        </table>
                      <![endif]-->
                                    </td>
                                  </tr>
                                </tbody></table>
                              </div>
                              <!--[if mso | IE]>
                            </td>
                          
                        </tr>
                      
                                  </table>
                                <![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]>
                          </td>
                        </tr>
                      </table>
                      
                      <table
                         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
                      >
                        <tr>
                          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                      <![endif]-->
                    <div style="margin:0px auto;max-width:600px;">
                      <table role="presentation" style="width:100%;" cellspacing="0" cellpadding="0" border="0" align="center">
                        <tbody>
                          <tr>
                            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                              <!--[if mso | IE]>
                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                
                        <tr>
                      
                            <td
                               class="" style="vertical-align:top;width:600px;"
                            >
                          <![endif]-->
                              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                <table role="presentation" style="vertical-align:top;" width="100%" cellspacing="0" cellpadding="0" border="0">
                                  <tbody><tr>
                                    <td style="font-size:0px;padding:10px 25px;word-break:break-word;" align="center">
                                      <table role="presentation" style="border-collapse:collapse;border-spacing:0px;" cellspacing="0" cellpadding="0" border="0">
                                        <tbody>
                                          <tr>
                                            <td style="width:550px;">
                                              <img alt="welcome image" src="https://images.unsplash.com/photo-1503792243040-7ce7f5f06085?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:14px;" width="550" height="auto" />
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody></table>
                              </div>
                              <!--[if mso | IE]>
                            </td>
                          
                        </tr>
                      
                                  </table>
                                <![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]>
                          </td>
                        </tr>
                      </table>
                      
                      <table
                         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
                      >
                        <tr>
                          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                      <![endif]-->
                    <div style="margin:0px auto;max-width:600px;">
                      <table role="presentation" style="width:100%;" cellspacing="0" cellpadding="0" border="0" align="center">
                        <tbody>
                          <tr>
                            <td style="direction:ltr;font-size:0px;padding:0 40px;text-align:center;">
                              <!--[if mso | IE]>
                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                
                            <tr>
                              <td
                                 class="" width="600px"
                              >
                          
                      <table
                         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:520px;" width="520"
                      >
                        <tr>
                          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                      <![endif]-->
                              <div style="margin:0px auto;max-width:520px;">
                                <table role="presentation" style="width:100%;" cellspacing="0" cellpadding="0" border="0" align="center">
                                  <tbody>
                                    <tr>
                                      <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                                        <!--[if mso | IE]>
                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                
                        <tr>
                      
                            <td
                               class="" style="vertical-align:top;width:520px;"
                            >
                          <![endif]-->
                                        <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                          <table role="presentation" style="vertical-align:top;" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tbody><tr>
                                              <td style="font-size:0px;padding:10px 25px;word-break:break-word;" align="left">
                                                <div style="font-family:Alata;font-size:18px;font-weight:400;line-height:24px;text-align:left;color:#000000;">
                                                  <h1 style="margin: 0; font-size: 32px; line-height: 40px;">Hi John! <br />Need to Reset your password?</h1>
                                                </div>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td style="font-size:0px;padding:10px 25px;word-break:break-word;" align="left">
                                                <div style="font-family:Alata;font-size:18px;font-weight:400;line-height:24px;text-align:left;color:#000000;">No problem! Just click the button below and you’ll be on your way. If you did not make this request, please ignore this email. <p></p>
                                                </div>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td vertical-align="middle" class="hover" style="font-size:0px;padding:10px 25px;word-break:break-word;" align="center">
                                                <table role="presentation" style="border-collapse:separate;line-height:100%;" cellspacing="0" cellpadding="0" border="0">
                                                  <tbody><tr>
                                                    <td role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#ea4a40;" valign="middle" bgcolor="#ea4a40" align="center">
                                                      <a href="https://google.com" style="display: inline-block; background: #ea4a40; color: #ffffff; font-family: Alata; font-size: 14px; font-weight: bold; line-height: 30px; margin: 0; text-decoration: none; text-transform: uppercase; padding: 10px 25px; mso-padding-alt: 0px; border-radius: 3px;" target="_blank"> Reset your password </a>
                                                    </td>
                                                  </tr>
                                                </tbody></table>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td style="font-size:0px;padding:10px 25px;word-break:break-word;" align="left">
                                                <div style="font-family:Alata;font-size:14px;font-weight:400;line-height:24px;text-align:left;color:#333333;">Have questions or need help? Email us at <a href="#" style="color: #ea4a40; text-decoration: none;"> hello@codedmails.com </a></div>
                                              </td>
                                            </tr>
                                          </tbody></table>
                                        </div>
                                        <!--[if mso | IE]>
                            </td>
                          
                        </tr>
                      
                                  </table>
                                <![endif]-->
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <!--[if mso | IE]>
                          </td>
                        </tr>
                      </table>
                      
                              </td>
                            </tr>
                          
                            <tr>
                              <td
                                 class="" width="600px"
                              >
                          
                      <table
                         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:520px;" width="520"
                      >
                        <tr>
                          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                      <![endif]-->
                              <div style="margin:0px auto;max-width:520px;">
                                <table role="presentation" style="width:100%;" cellspacing="0" cellpadding="0" border="0" align="center">
                                  <tbody>
                                    <tr>
                                      <td style="direction:ltr;font-size:0px;padding:0px;text-align:center;">
                                        <!--[if mso | IE]>
                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                
                        <tr>
                      
                            <td
                               class="" style="vertical-align:top;width:520px;"
                            >
                          <![endif]-->
                                        <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                          <table role="presentation" style="vertical-align:top;" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tbody><tr>
                                              <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                <p style="border-top:solid 1px #f4f4f4;font-size:1px;margin:0px auto;width:100%;">
                                                </p>
                                                <!--[if mso | IE]>
                        <table
                           align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #f4f4f4;font-size:1px;margin:0px auto;width:470px;" role="presentation" width="470px"
                        >
                          <tr>
                            <td style="height:0;line-height:0;">
                              &nbsp;
                            </td>
                          </tr>
                        </table>
                      <![endif]-->
                                              </td>
                                            </tr>
                                            <tr>
                                              <td style="font-size:0px;padding:10px 25px;word-break:break-word;" align="center">
                                                <div style="font-family:Alata;font-size:14px;font-weight:400;line-height:24px;text-align:center;color:#333333;"><a class="footer-link" href="#" style="text-decoration: none; color: #000;">Support</a>   |   <a class="footer-link" href="#" style="text-decoration: none; color: #000;">Forums</a>   |  <a class="footer-link" href="#" style="text-decoration: none; color: #000;">Contact</a>   |  <a class="footer-link" href="#" style="text-decoration: none; color: #000;">Log In</a></div>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td style="font-size:0px;padding:10px 25px;word-break:break-word;" align="center">
                                                <!--[if mso | IE]>
                      <table
                         align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                      >
                        <tr>
                      
                              <td>
                            <![endif]-->
                                                <table role="presentation" style="float:none;display:inline-table;" cellspacing="0" cellpadding="0" border="0" align="center">
                                                  <tbody><tr>
                                                    <td style="padding:4px;">
                                                      <table role="presentation" style="border-radius:3px;width:24px;" cellspacing="0" cellpadding="0" border="0">
                                                        <tbody><tr>
                                                          <td style="font-size:0;height:24px;vertical-align:middle;width:24px;">
                                                            <a href="#" target="_blank" style="color: #ea4a40; text-decoration: none;">
                                                              <img alt="twitter-logo" src="https://codedmails.com/images/social/black/twitter-logo-transparent-black.png" style="border-radius:3px;display:block;" width="24" height="24" />
                                                            </a>
                                                          </td>
                                                        </tr>
                                                      </tbody></table>
                                                    </td>
                                                  </tr>
                                                </tbody></table>
                                                <!--[if mso | IE]>
                              </td>
                            
                              <td>
                            <![endif]-->
                                                <table role="presentation" style="float:none;display:inline-table;" cellspacing="0" cellpadding="0" border="0" align="center">
                                                  <tbody><tr>
                                                    <td style="padding:4px;">
                                                      <table role="presentation" style="border-radius:3px;width:24px;" cellspacing="0" cellpadding="0" border="0">
                                                        <tbody><tr>
                                                          <td style="font-size:0;height:24px;vertical-align:middle;width:24px;">
                                                            <a href="#" target="_blank" style="color: #ea4a40; text-decoration: none;">
                                                              <img alt="facebook-logo" src="https://codedmails.com/images/social/black/facebook-logo-transparent-black.png" style="border-radius:3px;display:block;" width="24" height="24" />
                                                            </a>
                                                          </td>
                                                        </tr>
                                                      </tbody></table>
                                                    </td>
                                                  </tr>
                                                </tbody></table>
                                                <!--[if mso | IE]>
                              </td>
                            
                              <td>
                            <![endif]-->
                                                <table role="presentation" style="float:none;display:inline-table;" cellspacing="0" cellpadding="0" border="0" align="center">
                                                  <tbody><tr>
                                                    <td style="padding:4px;">
                                                      <table role="presentation" style="border-radius:3px;width:24px;" cellspacing="0" cellpadding="0" border="0">
                                                        <tbody><tr>
                                                          <td style="font-size:0;height:24px;vertical-align:middle;width:24px;">
                                                            <a href="#" target="_blank" style="color: #ea4a40; text-decoration: none;">
                                                              <img alt="instagram-logo" src="https://codedmails.com/images/social/black/instagram-logo-transparent-black.png" style="border-radius:3px;display:block;" width="24" height="24" />
                                                            </a>
                                                          </td>
                                                        </tr>
                                                      </tbody></table>
                                                    </td>
                                                  </tr>
                                                </tbody></table>
                                                <!--[if mso | IE]>
                              </td>
                            
                              <td>
                            <![endif]-->
                                                <table role="presentation" style="float:none;display:inline-table;" cellspacing="0" cellpadding="0" border="0" align="center">
                                                  <tbody><tr>
                                                    <td style="padding:4px;">
                                                      <table role="presentation" style="border-radius:3px;width:24px;" cellspacing="0" cellpadding="0" border="0">
                                                        <tbody><tr>
                                                          <td style="font-size:0;height:24px;vertical-align:middle;width:24px;">
                                                            <a href="#" target="_blank" style="color: #ea4a40; text-decoration: none;">
                                                              <img alt="dribbble-logo" src="https://codedmails.com/images/social/black/linkedin-logo-transparent-black.png" style="border-radius:3px;display:block;" width="24" height="24" />
                                                            </a>
                                                          </td>
                                                        </tr>
                                                      </tbody></table>
                                                    </td>
                                                  </tr>
                                                </tbody></table>
                                                <!--[if mso | IE]>
                              </td>
                            
                          </tr>
                        </table>
                      <![endif]-->
                                              </td>
                                            </tr>
                                            <tr>
                                              <td style="font-size:0px;padding:10px 25px;word-break:break-word;" align="center">
                                                <div style="font-family:Alata;font-size:14px;font-weight:400;line-height:24px;text-align:center;color:#333333;">123 Medalling Jr., Suite 100, Parrot Park, CA 12345<br /> © 2020 [Coded Mails] Inc.</div>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td style="font-size:0px;padding:10px 25px;word-break:break-word;" align="center">
                                                <div style="font-family:Alata;font-size:14px;font-weight:400;line-height:24px;text-align:center;color:#333333;">Update your <a href="https://google.com" style="color: #ea4a40; text-decoration: none;">email preferences</a> to choose the types of emails you receive, or you can <a href="https://google.com" style="color: #ea4a40; text-decoration: none;"> unsubscribe </a>from all future emails.</div>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td style="font-size:0px;padding:10px 25px;word-break:break-word;" align="center">
                                                <table role="presentation" style="border-collapse:collapse;border-spacing:0px;" cellspacing="0" cellpadding="0" border="0">
                                                  <tbody>
                                                    <tr>
                                                      <td style="width:50px;">
                                                        <img alt="image description" src="https://codedmails.com/images/logo-circle-gray.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:14px;" width="50" height="auto" />
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          </tbody></table>
                                        </div>
                                        <!--[if mso | IE]>
                            </td>
                          
                        </tr>
                      
                                  </table>
                                <![endif]-->
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <!--[if mso | IE]>
                          </td>
                        </tr>
                      </table>
                      
                              </td>
                            </tr>
                          
                            <tr>
                              <td
                                 class="" width="600px"
                              >
                          
                      <table
                         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:520px;" width="520"
                      >
                        <tr>
                          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                      <![endif]-->
                              <div style="margin:0px auto;max-width:520px;">
                                <table role="presentation" style="width:100%;" cellspacing="0" cellpadding="0" border="0" align="center">
                                  <tbody>
                                    <tr>
                                      <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                                        <!--[if mso | IE]>
                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                
                        <tr>
                      
                            <td
                               class="" style="vertical-align:top;width:520px;"
                            >
                          <![endif]-->
                                        <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                          <table role="presentation" style="vertical-align:top;" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tbody><tr>
                                              <td style="font-size:0px;word-break:break-word;">
                                                <!--[if mso | IE]>
                    
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td height="1" style="vertical-align:top;height:1px;">
                      
                    <![endif]-->
                                                <div style="height:1px;">   </div>
                                                <!--[if mso | IE]>
                    
                        </td></tr></table>
                      
                    <![endif]-->
                                              </td>
                                            </tr>
                                          </tbody></table>
                                        </div>
                                        <!--[if mso | IE]>
                            </td>
                          
                        </tr>
                      
                                  </table>
                                <![endif]-->
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <!--[if mso | IE]>
                          </td>
                        </tr>
                      </table>
                      
                              </td>
                            </tr>
                          
                                  </table>
                                <![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]>
                          </td>
                        </tr>
                      </table>
                      <![endif]-->
                  </div>
                
                
                </body></html>`,
            }

            sendEmail(forgetEmail);
            
            /* #swagger.responses[200] = {
                    description: "sending email contain password reset token",
                    schema: { 
                        message:"email send successfully send",
                    }
                } 
            */
                /**
                 * to do 
                 * ++++++
                 * email notifications here
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
          /**
           * to do 
           * ++++++
           * email notifications here
           */

          res.status(200).json({message:`Dear ${result.firstName} password reset successful, you can now login`, admin})
      })  
    })
}







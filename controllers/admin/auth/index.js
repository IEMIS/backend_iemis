const jwt = require("jsonwebtoken");
require("dotenv").config();
const expressJwt = require("express-jwt");
const _ = require("lodash");

const Admin = require("../../../models/admin")


exports.signin = async (req, res)=>{
    const {email, password} = req.body;
    console.log(req.body)
  
    /* 
       #swagger.tags = ['Admin-Auth']
      #swagger.description = 'Endpoint allow admin to signin' 
  
        #swagger.parameters['obj'] = {
        in: 'body',
        description: 'admin login details',
        required: true,
        type: 'object',
        schema: {
                    $phone: "admin@gmail.com",
                    $password: "password_demo_123",
                }
       } 
    */
   const isAdmin = await  Admin.findOne({email});
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
    ///if(!isUser.authenticate(password)){
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
        { _id: user._id, role:"admin" },
        process.env.JWT_SECRET
    );
    // persist the token as 't' in cookie with expiry date
    res.cookie("t", token, { expire: new Date() + 9999 });
    // retrun response with user and token to frontend client
    const { _id, firstName, lastName } = user;

    /* #swagger.responses[200] = {
                description: "Admin successfully login",
                schema: { 
                    "message":"adminsuccessfully login",
                    "data":{
                        "token":"token",
                        "student":{
                            "_id":"0030303",
                            "email":"admin@gmail.com",
                            "First Name":"ade",
                            "Last Name":"Yemi",
                        }
                    }
                 }
            } 
        */
    return res.json({ token, student: { _id, firstName, lastName, email } });
}

exports.forgetPassword = async (req, res)=>{
    /*
      #swagger.tags = ['Admin-Auth']
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
    Admin.findOne({email}, (err, admin)=>{
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
        /**
         * send email notification to the parents 
        */

        /* #swagger.responses[200] = {
                description: "sending email contain password reset token",
                schema: { 
                    message:"email send successfully send",
                 }
            } 
        */
       res.status(200).json({admin})
   })
    ///res.json(req.body)
}


exports.resetPassword = async (req, res)=>{
     /*
      #swagger.tags = ['Admin-Auth']
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
   const { email, resetToken,password, passwordConfirmation} = req.body;
    Admin.findOne({email}, (err, admin)=>{
      if(err || !admin){
           /* #swagger.responses[404] = {
               description: "Invalid ",
               schema: { 
                   error:"user not found",
                }
           } 
           */
          return res.status(404).json({error:"user not found"});
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
      res.status(200).json({message:"password successfully reset, you can now login", admin})
    })
}
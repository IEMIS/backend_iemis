const jwt = require("jsonwebtoken");
const expressJWT = require('express-jwt');
const _ = require("lodash");
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();
import * as models from '../../../../models'
//const  Admin from '../../../../models/admin.js'
//const Admin = require('../../../../models/admin');




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
    
    //const { _id, firstName, lastName } = user;

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

            const updatedFields = {resetToken:uuidv4()};
            console.log({admin, updatedFields})
            
            
            admin = _.extend(admin, updatedFields);
            admin.save((er, result)=>{
                console.log({er, result})
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
      
                res.status(200).json({message:`Dear ${result.firstName} password reset request is successful, check your email for details`, result})
            })
            
       //res.status(200).json({admin})
   })
    ///res.json(req.body)
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







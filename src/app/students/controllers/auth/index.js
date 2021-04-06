const jwt = require("jsonwebtoken");
require("dotenv").config();
const _ = require("lodash");
const { v4: uuidv4 } = require('uuid');

import * as models from '../../../../models'
const Student = require("../../../../models/students")


exports.signin = async (req, res)=>{
    const {studentId, password} = req.body;
    console.log(req.body)
  
   /* #swagger.tags = ['Student Authentication Page']
      #swagger.description = 'Endpoint to sign in a specific student and have access to their data' 
  
        #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Student Students login details',
        required: true,
        type: 'object',
        schema: {
                    $studentId: "011273Vb",
                    $password: "password_demo_123",
                }
       } 
    */
   const isUser = await  models.Student.findOne({studentId});
   if(!isUser){
        /* #swagger.responses[404] = {
                description: "user not found",
                schema: { 
                    "error ":"invalid Student Id ",
                 }
            } 
        */
       return res.status(404).json({error:"Invalid Student Id "})
    }
    const user = await isUser.authenticate(password);
    ///if(!isUser.authenticate(password)){
    if(!user){
        /* #swagger.responses[405] = {
                description: "Password error",
                schema: { 
                    "error ":"student Id and Password not match, incorrect password",
                 }
            } 
        */
       return res.status(405).json({error:"student Id and Password not match, incorrect password "})
    }
     // generate a token with user id and secret
     const token = jwt.sign(
        { _id: user._id, role:"student" },
        process.env.JWT_SECRET
    );
    // persist the token as 't' in cookie with expiry date
    res.cookie("t", token, { expire: new Date() + 9999 });
    // retrun response with user and token to frontend client
    const { _id, firstName, lastName } = isUser;

    /* #swagger.responses[200] = {
                description: "Login successfully",
                schema: { 
                    "message":"student successfully login",
                    "data":{
                        "token":"token",
                        "student":{
                            "_id":"0030303",
                            "studentId":"49494",
                            "First Name":"ade",
                            "Last Name":"Yemi",
                        }
                    }
                 }
            } 
        */
    return res.json({ token, student: { _id, firstName, lastName, studentId } });
}

exports.forgetPassword = async (req, res)=>{
    /*
      #swagger.tags = ['Student Authentication Page']
      #swagger.description = 'Endpoint to request for password reset token' 
  
        #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Password reset token',
        required: true,
        type: 'object',
        schema: {
             $studentId: "011273Vb",
        }
      } 
    */
   const { studentId} = req.body;
    models.Student.findOne({studentId}, (err, student)=>{
       if(err || !student){
            /* 
                #swagger.responses[404] = {
                    description: "Invalid students Id",
                    schema: { 
                        error:"invalid students Id",
                    }
                } 
            */
           return res.status(404).json({error:"invalid student Id"});
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
            console.log({student, updatedFields})
            
            
            student = _.extend(student, updatedFields);
            student.save((er, result)=>{
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
            
       //res.status(200).json({student})
   })
    ///res.json(req.body)
}


exports.resetPassword = async (req, res)=>{
     /*
      #swagger.tags = ['Student Authentication Page']
      #swagger.description = 'Endpoint reset password' 
  
        #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Password reset',
        required: true,
        type: 'object',
        schema: {
             $studentId: "011273Vb",
             $resetToken: "011273Vb",
             $password: "011273Vb",
             $passwordConfirmation: "011273Vb",
        }
      } 
    */
   const { resetToken,password, passwordConfirmation} = req.body;
    models.Student.findOne({resetToken}, (err, student)=>{
      if(err || !student){
           /* #swagger.responses[404] = {
               description: "Invalid students Id",
               schema: { 
                   error:"invalid students Id",
                }
           } 
           */
          return res.status(404).json({error:"invalid student Id"});
       }
       if(student.resetToken !== resetToken){
           /* #swagger.responses[405] = {
               description: "Invalid token",
               schema: { 
                   error:"invalid reset tokem",
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

       /* #swagger.responses[200] = {
               description: "reset password",
               schema: { 
                   message:"password successfully reset, you can now login",
                }
           } 
       */
           const updatedFields = {resetToken:'',password};
           student = _.extend(student, updatedFields);
           student.save((er, result)=>{
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
     
               res.status(200).json({message:`Dear ${result.firstName} password reset successful, you can now login`, student})
           }) 
      //res.status(200).json({message:"password reset successful, you can now login",student})
    })
    //res.json(req.body)
}
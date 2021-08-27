const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();
import * as models from '../../../../models'
const {sendEmail} = require("../../midleware/helper")

exports.signin = async (req, res)=>{
    const {email, password} = req.body;
    /* 
    */
   const isTeacher = await  models.Teacher.findOne({email});
   if(!isTeacher){
        /* 
        */
       return res.status(404).json({error:"Invalid email address"})
    }
    const user = await isTeacher.authenticate(password);
    console.log({user})
    if(!user){
        /* 
        */
       return res.status(405).json({error:"email and Password not match, incorrect password "})
    }
     // generate a token with user id and secret
     const token = jwt.sign(
        { _id: isTeacher._id, role:"isTeacher" },
        process.env.JWT_SECRET
    );
  
    res.cookie("t", token, { expire: new Date() + 9999 });
    /* 
    *
    */
    return res.json({ token, teacher:isTeacher });
}
exports.forgetPassword = async (req, res)=>{
    /*
     * 
    */
   const { email} = req.body;
    models.Teacher.findOne({email}, (err, teacher)=>{
       if(err || !teacher){
            /* 
            *
            */
           return res.status(404).json({error:"invalid email", err});
        }
        /**
         * send email notification 
        */

        /* #swagger.responses[200] = {
                description: "sending email contain password reset token",
                schema: { 
                    message:"email send successfully send",
                 }
            } 
        */

            const updatedFields = {resetToken:uuidv4()};
            console.log({teacher, updatedFields})
            
            
            teacher = _.extend(teacher, updatedFields);
            teacher.save((er, result)=>{
                console.log({er, result})
                if(er || !result){
                    /**
                     * docs here
                     */
                    return res.status(407).json({error:"error in resetting password", er})
                }
                /**
                 * to do 
                 * ++++++
                 * email notifications here
                 */
      
                res.status(200).json({message:`Dear ${result.names} password reset request is successful, check your email for details`, result})
            })
            
       //res.status(200).json({admin})
   })
    ///res.json(req.body)
}

exports.resetPassword = async (req, res)=>{
    /*
     *
    */
   const { resetToken,password, passwordConfirmation} = req.body;
    models.Teacher.findOne({resetToken}, (err, teacher)=>{
      if(err || !teacher){
           /*
           *
           */
          return res.status(404).json({error:"Invalid token"});
       }
       if(teacher.resetToken !== resetToken){
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
        * send email notification to the School authorities
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
      teacher = _.extend(teacher, updatedFields);
      teacher.save((er, result)=>{
          if(er || !result){
              /**
               * docs here
               */
              return res.status(407).json({error:"error in resetting password", er})
          }
          /**
           * to do 
           * ++++++
           * email notifications here
           */
          res.status(200).json({message:`Dear ${result.names} password reset successful, you can now login`, data:result})
      })
    })
}

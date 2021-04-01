const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();
import * as models from '../../../../models';

exports.signin = async (req, res)=>{
    const {email, password} = req.body;
    /* 
    */
   const isSchool = await  models.School.findOne({email});
   if(!isSchool){
        /* 
        *
        */
       return res.status(404).json({error:"Invalid email address"})
    }
    const user = await isSchool.authenticate(password);
    
    if(!user){
        /* 
        */
       return res.status(405).json({error:"email and Password not match, incorrect password "})
    }
     // generate a token with user id and secret
     const token = jwt.sign(
        { _id: isSchool._id, role:"schoolAdmin" },
        process.env.JWT_SECRET
    );
  
    res.cookie("t", token, { expire: new Date() + 9999 });

    /* 
    *
    */
    return res.json({ token, school: isSchool });
}

exports.forgetPassword = async (req, res)=>{
    /*
    *  
    */
   const { email} = req.body;
    models.School.findOne({email}, (err, school)=>{
       if(err || !school){
            /* 
            * 
            */
           return res.status(404).json({error:"invalid email"});
        }
        /**
         * send email notification  
        */

        /* 
        *
        */
            const updatedFields = {resetToken:uuidv4()};
            console.log({school, updatedFields})
            
            
            school = _.extend(school, updatedFields);
            school.save((er, result)=>{
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
      
                res.status(200).json({message:`Dear ${result.names} password reset request is successful, check your email for details`, result})
            })
   })
}


exports.resetPassword = async (req, res)=>{
    /*
     *
    */
   const { resetToken,password, passwordConfirmation} = req.body;
    models.School.findOne({resetToken}, (err, school)=>{
      if(err || !school){
           /*
           *
           */
          return res.status(404).json({error:"Invalid token"});
       }
       if(school.resetToken !== resetToken){
           /*
           *
           */
           return res.status(405).json({error:"invalid reset token"});
        }
        if(password !== passwordConfirmation){
            /*
            *
            */
            return res.status(406).json({error:"Password must match each other"});
        }
       /**
        * send email notification 
       */

       /*
       *
       */

      const updatedFields = {resetToken:'',password};
      school = _.extend(school, updatedFields);
      school.save((er, result)=>{
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
          res.status(200).json({message:`Dear ${result.names} password reset successful, you can now login`, school})
      })  
    })
}







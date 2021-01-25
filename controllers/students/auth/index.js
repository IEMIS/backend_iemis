const jwt = require("jsonwebtoken");
require("dotenv").config();
const expressJwt = require("express-jwt");
const _ = require("lodash");

const Student = require("../../../models/students")


exports.signin = async (req, res)=>{
    const {studentId, password} = req.body;
  
   /*	
      #swagger.tags = ['Student Authentication endpoint]
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
   const isUser = await  Student.findOne({studentId});
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
    const { _id, firstName, lastName } = user;

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
      #swagger.tags = ['Student Authentication endpoint]
      #swagger.description = 'Endpoint to sign in a specific student and have access to their data' 
  
        #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Student information.',
        required: true,
        type: 'object',
        schema: { $ref: "#/definitions/students"}
      } 
    */
    res.json(req.body)
}


exports.resetPassword = async (req, res)=>{
       /*	
      #swagger.tags = ['Student Authentication endpoint]
      #swagger.description = 'Endpoint to sign in a specific student and have access to their data' 
  
        #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Student information.',
        required: true,
        type: 'object',
        schema: { $ref: "#/definitions/students"}
      } 
    */
    res.json(req.body)
}
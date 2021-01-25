const jwt = require("jsonwebtoken");
require("dotenv").config();
const expressJwt = require("express-jwt");
const _ = require("lodash");

const Student = require("../../models/students");

exports.signup = async (req, res) =>{
      /* 	#swagger.tags = ['Student Creation']
      #swagger.description = 'Endpoint to sign in a specific user' */

  /*	#swagger.parameters['obj'] = {
          in: 'body',
          description: 'User information.',
          required: true,
          type: 'object',
          schema: { $ref: "#/definitions/AddUser" }
  } */

     /*
    definitions: {
        User: {
            name: "Jhon Doe",
            age: 29,
            parents: {
                father: "Simon Doe",
                mother: "Marie Doe"
            },
            diplomas: [
                {
                    school: "XYZ University",
                    year: 2020,
                    completed: true,
                    internship: {
                        hours: 290,
                        location: "XYZ Company"
                    }
                }
            ]
        },
        AddUser: {
            $name: "Jhon Doe",
            $age: 29,
            about: ""
        }
    }
    */
    console.log(req.body)
}

exports.resp = async (req, res)=>{
        /* #swagger.responses[001] = {
        description: "myBoolean",
        schema: { $ref: "#/definitions/myBoolean" }
    } */
  
    /* #swagger.responses[002] = {
        description: "myNumber",
        schema: { $ref: "#/definitions/myNumber" }
    } */
  
    /* #swagger.responses[003] = {
        description: "myString",
        schema: { $ref: "#/definitions/myString" }
    } */
  
    /* #swagger.responses[004] = {
        description: "myObject",
        schema: { $ref: "#/definitions/myObject" }
    } */
  
    /* #swagger.responses[005] = {
        description: "myArrayOfBooleans",
        schema: { $ref: "#/definitions/myArrayOfBooleans" }
    } */
  
    /* #swagger.responses[006] = {
        description: "myArrayOfNumbers",
        schema: { $ref: "#/definitions/myArrayOfNumbers" }
    } */
  
    /* #swagger.responses[007] = {
        description: "myArrayOfStrings",
        schema: { $ref: "#/definitions/myArrayOfStrings" }
    } */
  
    /* #swagger.responses[008] = {
        description: "myArrayOfObjects",
        schema: { $ref: "#/definitions/myArrayOfObjects" }
    } */
  
    /* #swagger.responses[009] = {
        description: "myReferencedObjectArray",
        schema: { $ref: "#/definitions/myReferencedObjectArray" }
    } */
    res.json({result:"testing docuementation"})
}
const express = require("express");
const {signin, forgetPassword, resetPassword} = require("../controllers/students/auth/index");
const router = express.Router();

const {studentSignupValidator} = require("../helpers/validator/student")
 // #swagger.start

/*	
    #swagger.tags = ['Student Authentication endpoint]
    #swagger.description = 'Endpoint to sign in a specific student and have access to their data' 
*/
router.post("/student/signin", studentSignupValidator, signin);
router.post("/student/forgetPassword", studentSignupValidator, forgetPassword);
router.post("/student/resetPassword", studentSignupValidator, resetPassword);



 // #swagger.end






module.exports = router;
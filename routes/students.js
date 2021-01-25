const express = require("express");
const {signin, forgetPassword, resetPassword} = require("../controllers/students/auth/index");
const router = express.Router();

const {studentSignupValidator} = require("../helpers/validator/student")
 // #swagger.start

router.post("/student/signin", signin);
router.post("/student/forgetPassword", forgetPassword);
router.post("/student/resetPassword", resetPassword);



 // #swagger.end






module.exports = router;
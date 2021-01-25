const express = require("express");
const { signup, resp } = require("../controllers/auth/StudentAuth");
const router = express.Router();

const {studentSignupValidator} = require("../helpers/validator/student")

router.post("/student", studentSignupValidator,signup);

app.get('/responses', resp)





module.exports = router;
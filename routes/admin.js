const express = require("express");
const router = express.Router();


const {signin, forgetPassword, resetPassword} = require("../controllers/admin/auth");
const {create, createDistric} = require("../controllers/admin/admin")
const {adminSignUpValidator} = require("../helpers/validator")



router.post("/admin/signin", signin);
router.post("/admin/forgetPassword", forgetPassword);
router.post("/admin/resetPassword", resetPassword);
router.post("/admin", create);
router.post("/admin/district", createDistric);






module.exports = router;
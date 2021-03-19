//const express = require("express");
import express from 'express';
const router = express.Router();


//const {signin, forgetPassword, resetPassword, requiredSignin, isSuperAdmin} = require("../controllers/admin/auth/auth");
import * as Auth from '../controllers/auth'
//console.log({Auth})
//const {create, createDistric, districtList, districtById, oneDistrict, updateDistrict, deleteDistrict} = require("../controllers/admin/admin");
import * as Ctr from '../controllers/admin';
//const {adminSignUpValidator} = require("../helpers/validator")
import * as validator from "../midleware/validator";
import * as access from "../midleware";




router.post("/admin/signin", Auth.signin);
router.post("/admin/forgetPassword", Auth.forgetPassword);
router.post("/admin/resetPassword", Auth.resetPassword);

router.post("/admin", validator.createAdmin, access.requiredSignin, Ctr.create);
router.get("/admin/district", Ctr.districtList);
router.post("/admin/district", Ctr.createDistric);
router.delete("/admin/district/:districtId", Ctr.deleteDistrict);
router.get("/admin/district/:districtId", Ctr.oneDistrict);
router.put("/admin/district/:districtId", Ctr.updateDistrict);


router.param("districtId",Ctr.districtById)

export default router;
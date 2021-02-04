const express = require("express");
const router = express.Router();


const {signin, forgetPassword, resetPassword, requiredSignin, isSuperAdmin} = require("../controllers/admin/auth");
const {create, createDistric, districtList, districtById, oneDistrict, updateDistrict, deleteDistrict} = require("../controllers/admin/admin")
const {adminSignUpValidator} = require("../helpers/validator")



router.post("/admin/signin", signin);
router.post("/admin/forgetPassword", forgetPassword);
router.post("/admin/resetPassword", resetPassword);
router.post("/admin", requiredSignin, isSuperAdmin, create);
router.post("/admin/district",requiredSignin, isSuperAdmin, createDistric);
router.get("/admin/district", districtList);
router.get("/admin/district/:districtId", oneDistrict);
router.put("/admin/district/:districtId", updateDistrict);
router.delete("/admin/district/:districtId", deleteDistrict);

router.param("districtId",districtById)

module.exports = router;
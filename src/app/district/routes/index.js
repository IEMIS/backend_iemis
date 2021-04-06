import express from 'express';
const router = express.Router();

import * as Auth from '../controllers/auth'
import * as Ctr from '../controllers';
import * as Valid from '../midleware/validator';
import * as Mid from '../midleware';
import * as AdminAuth from '../../admin/midleware';

/**
 * District login services
 */
router.post("/district/signin", Auth.signin);
router.post("/district/forgetPassword", Auth.forgetPassword);
router.post("/district/resetPassword", Auth.resetPassword);

/**
 * Only Admin can 
 *  ---create District 
 *  ---Read all the district
 *  ---count total numbers of district
 * 
 */

router.post("/district", Valid.createDistrictValidator, AdminAuth.requiredSignin, AdminAuth.isSuperAdmin, Ctr.create);
router.get("/district", AdminAuth.requiredSignin, AdminAuth.isSuperAdmin, Ctr.districts);
router.get("/district/count", AdminAuth.requiredSignin, AdminAuth.isSuperAdmin, Ctr.countDistrict);

/**
 * The Dististrci can  
 * --read it self 
 * --Update itself
 * --Delete itself
 * --can count school in it
 * --can count staff working in distrcit
 * --can can the students in it district 
 * 
 */
router.get("/district/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.district);
router.put("/district/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.update);
router.delete("/district/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.delete);  //countSchoolInDistrict

router.get("/district/school/count/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.countSchoolInDistrict);
router.get("/district/staff/count/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.countstaffInDistrict);
router.get("/district/student/count/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.countstudentInDistrict);
router.get("/district/student/gender/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.countstudentInDistrict);
//router.get("/district/school/count/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.district);



router.param("districtId", Ctr.districtById)

export default router;
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
 *  ---create District  ********district admin must not create district************** 
 *  ---Read all the district
 *  ---count total numbers of district
 * 
 * 
 * router.post("/district", Valid.createDistrictValidator, AdminAuth.requiredSignin, AdminAuth.isSuperAdmin, Ctr.create);
router.get("/district", AdminAuth.requiredSignin, AdminAuth.isSuperAdmin, Ctr.districts);
router.get("/district/count", AdminAuth.requiredSignin, AdminAuth.isSuperAdmin, Ctr.countDistrict);
 * 
 */

router.post("/district", Valid.createDistrictValidator, Ctr.create);
router.get("/district",  Ctr.districts);
router.get("/district/count",  Ctr.countDistrict);



/**
 * The District can 
 * --read it self 
 * --Update itself
 * --Delete itself
 * --can count school in it
 * --can count staff working in distrcit
 * --can can the students in it district 
 * 
 */
router.get("/district/:districtId",  Ctr.district);
router.put("/district/:districtId",  Ctr.update);
router.delete("/district/:districtId",  Ctr.delete);  //countSchoolInDistrict
/*
router.get("/district/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.district);
router.put("/district/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.update);
router.delete("/district/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.delete); 


router.get("/district/school/count/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.countSchoolInDistrict);
router.get("/district/staff/count/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.countstaffInDistrict);
router.get("/district/student/count/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.countstudentInDistrict);
router.get("/district/student/gender/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.countstudentInDistrict);
//router.get("/district/school/count/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.district);
*/

router.get("/district/schools/:districtId",  Ctr.schoolInDistrict);
router.get("/district/students/:districtId",  Ctr.studentInDistrict);


router.get("/district/school/count/:districtId",  Ctr.countSchoolInDistrict);
router.get("/district/staff/count/:districtId",  Ctr.countstaffInDistrict);
router.get("/district/student/count/:districtId",  Ctr.countstudentInDistrict);
router.get("/district/student/gender/:districtId",  Ctr.countstudentInDistrict);




router.param("districtId", Ctr.districtById)

export default router;
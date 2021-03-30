import express from 'express';
const router = express.Router();

import * as Auth from '../controllers/auth'
import * as Ctr from '../controllers';
//import * as Valid from '../midleware/validator';
import * as Mid from '../midleware';




/**
 * Admin services
 */
router.post("/district/signin", Auth.signin);
router.post("/district/forgetPassword", Auth.forgetPassword);
router.post("/district/resetPassword", Auth.resetPassword);

router.post("/district", Mid.requiredSignin, Mid.isDistrict, Ctr.create);
router.get("/district", Mid.requiredSignin, Mid.isDistrict, Ctr.districts);
router.get("/district/count", Mid.requiredSignin, Mid.isDistrict, Ctr.countDistrict);


router.get("/district/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.district);
router.put("/district/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.update);
router.delete("/district/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.delete);  //countSchoolInDistrict

router.get("/district/school/count/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.countSchoolInDistrict);
router.get("/district/staff/count/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.countstaffInDistrict);
router.get("/district/student/count/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.countstudentInDistrict);
router.get("/district/student/gender/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.countstudentInDistrict);
router.get("/district/school/count/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.district);



router.param("districtId", Ctr.districtById)

export default router;
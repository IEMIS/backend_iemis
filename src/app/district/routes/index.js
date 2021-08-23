import express from 'express';
const router = express.Router();

import * as Auth from '../controllers/auth'
import * as Ctr from '../controllers';
import * as Valid from '../midleware/validator';
import * as Mid from '../midleware';

// router.post("/district/signin", Auth.signin);
// router.post("/district/forgetPassword", Auth.forgetPassword);
// router.post("/district/resetPassword", Auth.resetPassword);

// router.get("/district/district/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.district);
// // router.put("/district/district/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.update);
// router.delete("/district/district/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.delete); 


// router.get("/district/school/count/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.countSchoolInDistrict);
// router.get("/district/staff/count/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.countstaffInDistrict);
// router.get("/district/student/count/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.countstudentInDistrict);
// router.get("/district/student/gender/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.countstudentInDistrict);
// //router.get("/district/school/count/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.district);


// router.get("/district/schools/:districtId",  Ctr.schoolInDistrict);
// router.get("/district/students/:districtId",  Ctr.studentInDistrict);


// router.get("/district/school/count/:districtId",  Ctr.countSchoolInDistrict);
// router.get("/district/staff/count/:districtId",  Ctr.countstaffInDistrict);
// router.get("/district/student/count/:districtId",  Ctr.countstudentInDistrict);
// router.get("/district/student/gender/:districtId",  Ctr.countstudentInDistrict);




router.param("districtId", Ctr.districtById)

export default router;
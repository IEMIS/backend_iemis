import express from 'express';
const router = express.Router();

import * as Auth from '../controllers/auth'
import * as Ctr from '../controllers';
import * as Valid from '../midleware/validator';
import * as Mid from '../midleware';

/**
 * Admin services
*/
router.post("/admin/signin", Auth.signin);
router.post("/admin/forgetPassword", Auth.forgetPassword);
router.post("/admin/resetPassword", Auth.resetPassword);
router.post("/admin", Valid.adminCreator, Mid.requiredSignin, Mid.isSuperAdmin, Ctr.create);
router.get("/admin", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.admins);
router.get("/admin/count", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countAdmin);
router.get("/admin/:adminId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.admin);
router.put("/admin/:adminId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.update);
router.delete("/admin/:adminId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.delete);


/***
 *  District Services
*/
router.get("/admin/district", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.districts);
router.post("/admin/district", Valid.districtCreator, Mid.requiredSignin, Mid.isSuperAdmin, Ctr.createDistric);
router.delete("/admin/district/:districtId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.deleteDistrict);
router.get("/admin/district/:districtId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.district);
router.put("/admin/district/:districtId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.updateDistrict);
router.get("/admin/district/data/count", Mid.requiredSignin, Mid.isSuperAdmin,Ctr.countDistrict);

/**
  * School services
*/

router.get("/admin/school", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.schools);
router.get("/admin/school", Valid.schoolCreator, Mid.requiredSignin, Mid.isSuperAdmin, Ctr.createSchool);
router.get("/admin/school/:schoolId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.school);
router.put("/admin/school/:schoolId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.updateSchool);
router.delete("/admin/school/:schoolId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.deleteSchool);
router.get("/admin/school/data/count", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countSchool);

/**
 *  Student Services 
*/
router.get("/admin/student",Mid.requiredSignin, Mid.isSuperAdmin, Ctr.students)
router.post("/admin/student",Valid.studentCreator, Mid.requiredSignin, Mid.isSuperAdmin, Ctr.createStudent)
router.get("/admin/student/:studentId",Mid.requiredSignin, Mid.isSuperAdmin, Ctr.student)
router.put("/admin/student/:studentId",Mid.requiredSignin, Mid.isSuperAdmin, Ctr.updateStudent)
router.delete("/admin/student/:studentId",Mid.requiredSignin, Mid.isSuperAdmin, Ctr.deleteStudent)
router.get("/admin/student/data/count", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countStudent)
router.get("/admin/student/data/count/yearadmission", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countStudentByYear)
router.get("/admin/student/data/count/class", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countStudentByClass)
router.get("/admin/student/data/count/yearadmission", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countStudentByYear)
router.get("/admin/student/data/count/providence", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countStudentByProvidence)
router.get("/admin/student/data/count/search", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countStudentBySearch)
router.get("/admin/student/data/count", Ctr.countStudent)





router.param("studentId", Ctr.studentById)
router.param("schoolId", Ctr.schoolById)
router.param("adminId", Ctr.adminById)
router.param("districtId",Ctr.districtById)

export default router;
import express from 'express';
const router = express.Router();

import * as Auth from '../controllers/auth'
import * as Ctr from '../controllers';
import * as Valid from '../midleware/validator';
import * as Mid from '../midleware';


/**
 Auth
*/
router.post("/district/auth/signin", Auth.signin);
router.post("/district/auth/forgetPassword", Auth.forgetPassword);
router.post("/district/auth/resetPassword", Auth.resetPassword);

/*
 * District Services
*/
// router.get("/district/district", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.districts);
// router.post("/district/district", Valid.districtCreator, Mid.requiredSignin, Mid.isSuperAdmin, Ctr.createDistric);
// router.delete("/district/district/:districtId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.deleteDistrict);
// router.get("/district/district/:districtId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.district);
// router.put("/district/district/:districtId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.updateDistrict);
// router.get("/district/district/data/count", Mid.requiredSignin, Mid.isSuperAdmin,Ctr.countDistrict);


/**
  * School services
*/
router.get("/district/schools/:district", Mid.requiredSignin, Ctr.schools);
router.post("/district/school", Mid.requiredSignin,  Ctr.createSchool);
router.get("/district/school/:schoolId", Mid.requiredSignin,  Ctr.school);
router.put("/district/school/:schoolId", Mid.requiredSignin,  Ctr.updateSchool);
router.delete("/district/school/:schoolId", Mid.requiredSignin, Ctr.deleteSchool);
router.post("/district/school/data/school", Mid.requiredSignin,  Ctr.schoolData);


/**
 * Student Services 
*/
router.post("/district/student", Mid.requiredSignin,  Ctr.createStudent)
router.get("/district/students/:district",Mid.requiredSignin, Ctr.students)
router.get("/district/student/:studentId",Mid.requiredSignin, Ctr.student)
router.put("/district/student/:studentId",Mid.requiredSignin,  Ctr.updateStudent)
router.delete("/district/student/:studentId",Mid.requiredSignin,  Ctr.deleteStudent)

router.post("/district/student/data/student", Mid.requiredSignin, Ctr.StudentData);
router.post("/district/student/data/class", Mid.requiredSignin, Ctr.countStudentByClassAll)
router.post("/district/student/data/school", Mid.requiredSignin, Ctr.StudentDataBySchool);
router.get("/district/student/data/indicators", Mid.requiredSignin, Ctr.indicators);

/**
 * Teacher Services 
*/
router.post("/district/teacher", Mid.requiredSignin,  Ctr.createTeacher)
router.get("/district/teachers", Mid.requiredSignin,  Ctr.teachers)
router.get("/district/teacher/:teacherId", Mid.requiredSignin,  Ctr.teacher)
router.put("/district/teacher/:teacherId", Mid.requiredSignin,  Ctr.updateTeacher)
router.delete("/district/teacher/:teacherId", Mid.requiredSignin,  Ctr.deleteTeacher)


router.get("/district/teacher/data/school", Mid.requiredSignin,  Ctr.countTeacherBySchoolAll )



router.param("teacherId", Ctr.teacherById)
router.param("studentId", Ctr.studentById)
router.param("schoolId", Ctr.schoolById)
router.param("districtId",Ctr.districtById)

export default router;
































/* import express from 'express';
const router = express.Router();

import * as Auth from '../controllers/auth'
import * as Ctr from '../controllers';
import * as Valid from '../midleware/validator';
import * as Mid from '../midleware';

router.post("/district/signin", Auth.signin);
router.post("/district/forgetPassword", Auth.forgetPassword);
router.post("/district/resetPassword", Auth.resetPassword);

// router.get("/district/district/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.district);
// // router.put("/district/district/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.update);
// router.delete("/district/district/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.delete); 


router.get("/district/school/count/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.countSchoolInDistrict);
router.get("/district/staff/count/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.countstaffInDistrict);
router.get("/district/student/count/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.countstudentInDistrict);
router.get("/district/student/gender/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.countstudentInDistrict);
//router.get("/district/school/count/:districtId", Mid.requiredSignin, Mid.isDistrict, Ctr.district);


router.get("/district/schools/:districtId",  Ctr.schoolInDistrict);
router.get("/district/students/:districtId",  Ctr.studentInDistrict);


router.get("/district/school/count/:districtId",  Ctr.countSchoolInDistrict);
router.get("/district/staff/count/:districtId",  Ctr.countstaffInDistrict);
router.get("/district/student/count/:districtId",  Ctr.countstudentInDistrict);
router.get("/district/student/gender/:districtId",  Ctr.countstudentInDistrict);




router.param("districtId", Ctr.districtById)

export default router;
*/
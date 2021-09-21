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

// router.get("/district/school", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.schools);
// router.post("/district/school", Valid.schoolCreator, Mid.requiredSignin, Mid.isSuperAdmin, Ctr.createSchool);
// router.get("/district/school/:schoolId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.school);
// router.put("/district/school/:schoolId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.updateSchool);
// router.delete("/district/school/:schoolId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.deleteSchool);
// router.post("/district/school", Valid.schoolCreator, Mid.requiredSignin, Mid.isSuperAdmin, Ctr.createSchool);



/**
 *  Student Services 
*/
// router.get("/district/student",Mid.requiredSignin, Mid.isSuperAdmin, Ctr.students)
// router.post("/district/student",Valid.studentCreator, Mid.requiredSignin, Mid.isSuperAdmin, Ctr.createStudent)
// router.get("/district/student/:studentId",Mid.requiredSignin, Mid.isSuperAdmin, Ctr.student)
// router.put("/district/student/:studentId",Mid.requiredSignin, Mid.isSuperAdmin, Ctr.updateStudent)
// router.delete("/district/student/:studentId",Mid.requiredSignin, Mid.isSuperAdmin, Ctr.deleteStudent)
// router.get("/district/student/data/count/class", Mid.requiredSignin, Mid.isSuperAdmin,  Ctr.countStudentByClassAll)



// router.get("/district/student/data/student", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.StudentData);
// router.post("/district/student/data/student/district", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.StudentDataByDistrict);
// router.post("/district/student/data/student/school", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.StudentDataBySchool);
// router.get("/district/student/data/indicators", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.indicators);

// router.get("/district/school/data/school", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.schoolData);
// router.post("/district/school/data/school/district", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.schoolDataByDistrict);
// router.post("/district/school/data/district", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.schoolByDistrict);



/**
 * Admin session services
*/
// router.get("/district/session",Mid.requiredSignin, Mid.isSuperAdmin, Ctr.sessions)
// router.post("/district/session",Valid.sessionCreator, Mid.requiredSignin, Mid.isSuperAdmin, Ctr.createSession)
// router.get("/district/session/:sessionId", Ctr.session)
// router.put("/district/session/:sessionId", Ctr.updateSession)
// router.delete("/district/session/:sessionId", Ctr.deleteSession)

/**
 * Admin classes services
*/

// router.get("/district/classes",Mid.requiredSignin, Mid.isSuperAdmin, Ctr.classesList)
// router.post("/district/classes",Valid.classCreator, Mid.requiredSignin, Mid.isSuperAdmin, Ctr.createClasses)
// router.get("/district/classes/:classId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.classes)
// router.put("/district/classes/:classId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.updateClasses)
// router.delete("/district/classes/:classId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.deleteClasses)



/**
 * Teacher Services 
*/
// router.get("/district/teachers", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.teachers)
// router.post("/district/teachers",Valid.teacherCreator, Mid.requiredSignin, Mid.isSuperAdmin, Ctr.createTeacher)
// router.get("/district/teachers/:teacherId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.teacher)
// router.put("/district/teachers/:teacherId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.updateTeacher)
// router.delete("/district/teachers/:teacherId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.deleteTeacher)
// router.get("/district/teachers/data/count", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countTeacher)
// router.get("/district/teachers/data/count/gender", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countTeacherByGender)
// router.get("/district/teachers/data/count/school", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countTeacherBySchoolAll )
// router.get("/district/teachers/data/count/staff", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countTeacherByTypeOfstaff)


// router.param("teacherId", Ctr.teacherById)
// router.param("classId", Ctr.classesById)
// router.param("sessionId", Ctr.sessionById)
// router.param("studentId", Ctr.studentById)
// router.param("schoolId", Ctr.schoolById)
// router.param("adminId", Ctr.adminById)
// router.param("districtId",Ctr.districtById)

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
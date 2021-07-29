import express from 'express';
const router = express.Router();

import * as Auth from '../controllers/auth'
import * as Ctr from '../controllers';
import * as Valid from '../midleware/validator';
import * as Mid from '../midleware';

/*
 * District Services
*/
router.get("/admin/district", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.districts);
router.post("/admin/district", Valid.districtCreator, Mid.requiredSignin, Mid.isSuperAdmin, Ctr.createDistric);
router.delete("/admin/district/:districtId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.deleteDistrict);
router.get("/admin/district/:districtId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.district);
router.put("/admin/district/:districtId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.updateDistrict);
router.get("/admin/district/data/count", Mid.requiredSignin, Mid.isSuperAdmin,Ctr.countDistrict);
router.get("/admin/district/data/count/search", Mid.requiredSignin, Mid.isSuperAdmin,Ctr.searchByDistrict);

/**
  * School services
*/
//router.get("/admin/school",Mid.requiredSignin, Mid.isSuperAdmin, Ctr.schools);
router.get("/admin/school", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.schools);
router.post("/admin/school", Valid.schoolCreator, Mid.requiredSignin, Mid.isSuperAdmin, Ctr.createSchool);
router.get("/admin/school/:schoolId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.school);
router.put("/admin/school/:schoolId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.updateSchool);
router.delete("/admin/school/:schoolId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.deleteSchool);
router.get("/admin/school/data/count", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countSchool);
router.get("/admin/school/data/count/district", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countSchoolByDistrict);
router.get("/admin/school/data/count/edulevel", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countSchoolByEduLevel);
router.get("/admin/school/data/count/ownership", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countSchoolByOwnerShip);
router.get("/admin/school/data/count/type", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countSchoolByType);
router.get("/admin/school/data/count/cat", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countSchoolByCat);


/**
 *  Student Services 
*/
router.get("/admin/student",Mid.requiredSignin, Mid.isSuperAdmin, Ctr.students)
router.post("/admin/student",Valid.studentCreator, Mid.requiredSignin, Mid.isSuperAdmin, Ctr.createStudent)
router.get("/admin/student/:studentId",Mid.requiredSignin, Mid.isSuperAdmin, Ctr.student)
router.put("/admin/student/:studentId",Mid.requiredSignin, Mid.isSuperAdmin, Ctr.updateStudent)
router.delete("/admin/student/:studentId",Mid.requiredSignin, Mid.isSuperAdmin, Ctr.deleteStudent)
router.get("/admin/student/data/count", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countStudent)
router.get("/admin/student/data/count/gender",  Ctr.countStudentByGender)
router.get("/admin/student/data/count/gender", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countStudentByGender)
router.get("/admin/student/data/count/class", Mid.requiredSignin, Mid.isSuperAdmin,  Ctr.countStudentByClassAll)
//router.get("/admin/student/data/count/class", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countStudentByClass)
router.get("/admin/student/data/count/yearadmission", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countStudentByYear)
router.get("/admin/student/data/count/providence", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countStudentByProvidence)
//router.get("/admin/student/data/count/search", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countStudentBySearch)
router.get("/admin/student/data/indicators", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.studentIndicators)



router.get("/admin/student/data/student", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.StudentData);
router.get("/admin/school/data/school", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.schoolData);
router.post("/admin/student/data/student/district", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.StudentDataByDistrict);
router.post("/admin/school/data/school/district", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.schoolDataByDistrict);

router.get("/admin/data/indicators", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.indicators);




/**
 * Admin session services
*/
router.get("/admin/session",Mid.requiredSignin, Mid.isSuperAdmin, Ctr.sessions)
//router.post("/admin/session", Ctr.createSession)
router.post("/admin/session",Valid.sessionCreator, Mid.requiredSignin, Mid.isSuperAdmin, Ctr.createSession)
router.get("/admin/session/:sessionId", Ctr.session)
router.put("/admin/session/:sessionId", Ctr.updateSession)
router.delete("/admin/session/:sessionId", Ctr.deleteSession)

/**
 * Admin classes services
*/
router.get("/admin/classes",Mid.requiredSignin, Mid.isSuperAdmin, Ctr.classesList)
router.post("/admin/classes",Valid.classCreator, Mid.requiredSignin, Mid.isSuperAdmin, Ctr.createClasses)
router.get("/admin/classes/:classId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.classes)
router.put("/admin/classes/:classId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.updateClasses)
router.delete("/admin/classes/:classId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.deleteClasses)

/**
 * Admin population services
*
//router.get("/admin/population",Mid.requiredSignin, Mid.isSuperAdmin, Ctr.PopulationList)
router.post("/admin/population",Valid.classCreator, Mid.requiredSignin, Mid.isSuperAdmin, Ctr.createPopulation)
router.get("/admin/population/:populationId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.Population)
router.put("/admin/population/:populationId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.updatePopulation)
router.delete("/admin/population/:population", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.deletePopulation)
*/

/**
 * Admin Teacher Services 
*/
router.get("/admin/teachers", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.teachers)
router.post("/admin/teachers",Valid.teacherCreator, Mid.requiredSignin, Mid.isSuperAdmin, Ctr.createTeacher)
router.get("/admin/teachers/:teacherId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.teacher)
router.put("/admin/teachers/:teacherId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.updateTeacher)
router.delete("/admin/teachers/:teacherId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.deleteTeacher)
router.get("/admin/teachers/data/count", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countTeacher)
router.get("/admin/teachers/data/count/gender", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countTeacherByGender)
router.get("/admin/teachers/data/count/school", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countTeacherBySchoolAll )
router.get("/admin/teachers/data/count/staff", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countTeacherByTypeOfstaff)






/**
 * Admin services
*/
router.post("/admin/auth/signin", Auth.signin);
router.post("/admin/auth/forgetPassword", Auth.forgetPassword);
router.post("/admin/auth/resetPassword", Auth.resetPassword);

router.post("/admin/admin", Valid.adminCreator, Mid.requiredSignin, Mid.isSuperAdmin, Ctr.create);
router.get("/admin/admin", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.admins);
router.get("/admin/admin/count", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.countAdmin);
router.get("/admin/admin/:adminId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.admin);
router.put("/admin/admin/:adminId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.update);
router.delete("/admin/admin/:adminId", Mid.requiredSignin, Mid.isSuperAdmin, Ctr.delete);


router.param("teacherId", Ctr.teacherById)
router.param("classId", Ctr.classesById)
router.param("sessionId", Ctr.sessionById)
router.param("studentId", Ctr.studentById)
router.param("schoolId", Ctr.schoolById)
router.param("adminId", Ctr.adminById)
router.param("districtId",Ctr.districtById)

export default router;
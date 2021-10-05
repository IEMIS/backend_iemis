import express from 'express';
const router = express.Router();

import * as Auth from '../controllers/auth'
import * as Ctr from '../controllers/index.js';
import * as Valid from '../midleware/validator';
import * as Mid from '../midleware';

//School login services 
router.post("/schools/signin", Auth.signin);
router.post("/schools/forgetPassword", Auth.forgetPassword);
router.post("/schools/resetPassword", Auth.resetPassword);

//Student services 
router.post("/schools/student", Mid.requiredSignin,  Ctr.createStudent)
router.get("/schools/students/:school",Mid.requiredSignin, Ctr.students)
router.get("/schools/student/:studentId",Mid.requiredSignin, Ctr.student)
router.put("/schools/student/:studentId",Mid.requiredSignin,  Ctr.updateStudent)
router.delete("/schools/student/:studentId",Mid.requiredSignin,  Ctr.deleteStudent)

//student data
router.get("/schools/student/data/class/school/:school", Mid.requiredSignin, Ctr.countStudentByClassInSchool)
router.get("/schools/student/data/school/:school", Mid.requiredSignin, Ctr.StudentDataBySchool);
router.get("/schools/student/data/indicators/:school", Mid.requiredSignin, Ctr.indicators);

router.get("/schools/school/data/:school", Mid.requiredSignin, Ctr.schoolData);


//teacher services 
router.post("/schools/teacher", Mid.requiredSignin,  Ctr.createTeacher)
router.get("/schools/teachers/:school", Mid.requiredSignin,  Ctr.teachers)
router.get("/schools/teacher/:teacherId", Mid.requiredSignin,  Ctr.teacher)
router.put("/schools/teacher/:teacherId", Mid.requiredSignin,  Ctr.updateTeacher)
router.delete("/schools/teacher/:teacherId", Mid.requiredSignin,  Ctr.deleteTeacher)
//teacher data

router.get("/schools/teacher/data/school/class/:school", Mid.requiredSignin,  Ctr.countTeacherInSchoolByClass )

//others services 
router.get("/schools/school/:school", Mid.requiredSignin,  Ctr.schools)
router.get("/schools/class", Mid.requiredSignin,  Ctr.classesList)
router.get("/schools/session", Mid.requiredSignin,  Ctr.sessions)

router.param("teacherId", Ctr.teacherById)
router.param("studentId", Ctr.studentById)

export default router;
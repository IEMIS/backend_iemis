import express from 'express';
const router = express.Router();

import * as Auth from '../controllers/auth'
import * as Ctr from '../controllers/index.js';
import * as Valid from '../midleware/validator';
import * as Mid from '../midleware';



router.post("/teacher/signin", Auth.signin);
router.post("/teacher/forgetPassword", Auth.forgetPassword);
router.post("/teacher/resetPassword", Auth.resetPassword);



router.post("/teacher",   Ctr.create);
router.get("/teacher",  Ctr.teachers);
router.get("/teacher/count",  Ctr.countTeacher);


router.get("/teacher/:schoolId",  Ctr.teacher);
router.put("/teacher/:schoolId",  Ctr.update);
router.delete("/teacher/:schoolId",  Ctr.delete);  


router.param("teacherId", Ctr.teacherById)

export default router;
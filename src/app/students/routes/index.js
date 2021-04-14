import express from 'express';
const router = express.Router();

import * as Auth from '../controllers/auth'
import * as Ctr from '../controllers';
import * as Valid from '../midleware/validator';
import * as Mid from '../midleware';


/**
 * Students login services
 */
router.post("/students/signin", Auth.signin);
router.post("/students/forgetPassword", Auth.forgetPassword);
router.post("/students/resetPassword", Auth.resetPassword);

/**
 * 
 */
 router.post("/students", Valid.studentCreator, Ctr.create);
 router.get("/students", Ctr.students);

 
 router.delete("/students/:studentId", Ctr.delete);
 router.get("/students/:studentId", Ctr.students);
 router.put("/students/:studentId", Ctr.update);

 router.get("/students/get/count", Ctr.countStudents);
 router.get("/students/get/gender", Ctr.studentByGender);


router.param("studentId", Ctr.studentById)

export default router;
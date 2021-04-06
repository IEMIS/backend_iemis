import express from 'express';
const router = express.Router();

import * as Auth from '../controllers/auth'
import * as Ctr from '../controllers/index.js';
import * as Valid from '../midleware/validator';
import * as Mid from '../midleware';


/**
 * Students login services
 */
router.post("/students/signin", Auth.signin);
router.post("/students/forgetPassword", Auth.forgetPassword);
router.post("/students/resetPassword", Auth.resetPassword);







//router.param("studentId", Ctr.schoolById)

export default router;
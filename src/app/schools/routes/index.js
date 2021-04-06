import express from 'express';
const router = express.Router();

import * as Auth from '../controllers/auth'
import * as Ctr from '../controllers/index.js';
import * as Valid from '../midleware/validator';
import * as Mid from '../midleware';
import * as DistrictAuth from '../../district/midleware';
import { Consola } from 'consola';

/**
 * District login services
 */
router.post("/schools/signin", Auth.signin);
router.post("/schools/forgetPassword", Auth.forgetPassword);
router.post("/schools/resetPassword", Auth.resetPassword);

/**
 * Only District can 
 *  ---create District 
 *  ---Read all the district
 *  ---count total numbers of district
 * router.post("/schools",  DistrictAuth.requiredSignin, DistrictAuth.isSuperAdmin, Ctr.create);
router.get("/schools", DistrictAuth.requiredSignin, DistrictAuth.isSuperAdmin, Ctr.schools);
router.get("/schools/count", DistrictAuth.requiredSignin, DistrictAuth.isSuperAdmin, Ctr.countSchool);
*/

router.post("/schools",   Ctr.create);
router.get("/schools",  Ctr.schools);
router.get("/schools/count",  Ctr.countSchool);

/**
 * The School can  
 * --read it self 
 * --Update itself
 * --Delete itself --- exception 
 * --can count students in it
 * --can count teachers in school
 * --can verify district she belong 
 * 
 */
router.get("/schools/:schoolId",  Ctr.school);
router.put("/schools/:schoolId",  Ctr.updateSchool);
router.delete("/schools/:schoolId",  Ctr.deleteSchool);  

router.get("/schools/get/students/gender", (req, res)=>{
    Consola({error:"servince is under construction", data:req.body})
    return res.status(403).json({error:"servince is under construction", data:req.body})
});


router.get("/schools/get/district/:schoolId",  Ctr.schoolbelongtoDistrict);
router.get("/schools/get/students/:schoolId",  Ctr.studentInSchool);



router.param("schoolId", Ctr.schoolById)

export default router;
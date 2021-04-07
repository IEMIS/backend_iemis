import express from 'express';
const router = express.Router();

import * as Auth from '../controllers/auth'
import * as Ctr from '../controllers';
import * as Valid from '../midleware/validator';
import * as Mid from '../midleware';


/**
 * District login services
 */
router.post("/staff/signin", Auth.signin);
router.post("/staff/forgetPassword", Auth.forgetPassword);
router.post("/staff/resetPassword", Auth.resetPassword);

/**
 * Only Admin can 
 *  ---create staff 
 *  ---Read all the staff
 *  ---count total numbers of staff
 * 
 */

router.post("/staff", Ctr.create);
router.get("/staff",  Ctr.staffs);
router.get("/staff/count",  Ctr.countStaff);

/**
 * The District can  
 * --read it self 
 * --Update itself
 * --Delete itself
 * --can count school in it
 * --can count staff working in distrcit
 * --can can the students in it district 
 * 
 */
router.get("/staff/:districtId",  Ctr.staff);
router.put("/staff/:districtId", Ctr.update);
router.delete("/staff/:districtId",  Ctr.delete);  

router.param("staffId", Ctr.staffById)

export default router;
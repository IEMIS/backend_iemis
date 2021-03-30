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




//


router.get("/admin/district", Ctr.districtList);
router.post("/admin/district", Ctr.createDistric);
router.delete("/admin/district/:districtId", Ctr.deleteDistrict);
router.get("/admin/district/:districtId", Ctr.oneDistrict);
router.put("/admin/district/:districtId", Ctr.updateDistrict);

router.param("adminId", Ctr.adminById)
router.param("districtId",Ctr.districtById)

export default router;
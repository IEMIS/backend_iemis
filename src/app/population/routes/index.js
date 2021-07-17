import express from 'express';
const router = express.Router();

import * as Ctr from '../controllers';
import * as Valid from '../midleware/validator';
import * as Mid from '../midleware';


router.post("/population",  Ctr.create);



//router.param("sessionId", )

export default router;
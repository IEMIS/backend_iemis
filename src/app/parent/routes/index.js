import express from 'express';
const router = express.Router();

import * as Ctr from '../controllers';
//import * as Valid from '../midleware/validator';
//import * as Mid from '../midleware';

router.post("/parent",  Ctr.create);


//router.param("subjectId", )

export default router;
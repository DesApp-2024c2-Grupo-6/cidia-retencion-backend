import express from 'express';

import { obtenerPeriodosLectivos } from '../controllers/periodosLectivos.controller';

const router = express.Router();

router.get('/', obtenerPeriodosLectivos);

export default router;

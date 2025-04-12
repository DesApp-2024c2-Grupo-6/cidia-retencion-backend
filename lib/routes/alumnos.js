import express from 'express';

import { obtenerAlumnos } from '../controllers/alumnos.controller';

const router = express.Router();

router.get('/carrera/:id', obtenerAlumnos);

export default router;

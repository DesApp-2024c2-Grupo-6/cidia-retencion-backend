import express from 'express';

import {
  obtenerAlumnos,
  obtenerDatosDeAlumnos,
} from '../controllers/alumnos.controller';

const router = express.Router();

router.get('/carrera/:id', obtenerAlumnos);
router.post('/statusAcademico/masivo', obtenerDatosDeAlumnos);

export default router;

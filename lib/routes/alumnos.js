import express from 'express';

import {
  obtenerAlumnos,
  obtenerDatosDeAlumnos,
  obtenerAlumnosPorCuatrimestre,
} from '../controllers/alumnos.controller';

const router = express.Router();

router.get('/carrera/:id', obtenerAlumnos);
router.post('/statusAcademico/masivo', obtenerDatosDeAlumnos);
router.get('/cuatrimestre/:id', obtenerAlumnosPorCuatrimestre);

export default router;

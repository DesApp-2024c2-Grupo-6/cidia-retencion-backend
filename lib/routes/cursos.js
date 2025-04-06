import express from 'express';

import {
  obtenerCurso,
  obtenerAsistenciasDeCurso,
} from '../controllers/cursos.controller';

import { obtenerAsistenciaCursada } from '../controllers/asistenciaCursadas.controller';

const router = express.Router();

router.get('/:id', obtenerCurso);
router.get('/:id/asistenciaPorClase', obtenerAsistenciasDeCurso);
router.get('/asistencia/:idMateria/:idPeriodo', obtenerAsistenciaCursada);

export default router;

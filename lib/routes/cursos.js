import express from 'express';

import {
  obtenerCurso,
  obtenerAsistenciasDeCurso,
} from '../controllers/cursos.controller';

const router = express.Router();

router.get('/:id', obtenerCurso);
router.get('/:id/asistenciaPorClase', obtenerAsistenciasDeCurso);

export default router;

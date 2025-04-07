import express from 'express';

import { obtenerCurso } from '../controllers/cursos.controller';

import {
  obtenerCursosDeMateria,
  obtenerAsistenciaFormateadaDeCurso,
} from '../controllers/asistenciaCursadas.controller';

const router = express.Router();

router.get('/:id', obtenerCurso);
router.get('/:id/asistenciaPorClase', obtenerAsistenciaFormateadaDeCurso);
router.get('/materia/:idMateria/periodo/:idPeriodo', obtenerCursosDeMateria);

//router.get('/asistencia/:idMateria/:idPeriodo', obtenerAsistenciaCursada);

export default router;

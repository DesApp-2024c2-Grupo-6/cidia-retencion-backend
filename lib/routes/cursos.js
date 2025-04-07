import express from 'express';

import { obtenerCurso } from '../controllers/cursos.controller';

import { obtenerAsistenciaDeTodosLosCursos } from '../controllers/asistenciaCursadas.controller';

const router = express.Router();

router.get('/:id', obtenerCurso);
router.get(
  '/materia/:idMateria/periodo/:idPeriodo',
  obtenerAsistenciaDeTodosLosCursos
);

export default router;

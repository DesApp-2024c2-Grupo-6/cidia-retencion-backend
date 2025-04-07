import express from 'express';

import {
  obtenerCurso,
  obtenerAsistenciaDeTodosLosCursos,
} from '../controllers/cursos.controller';

const router = express.Router();

router.get('/:id', obtenerCurso);
router.get(
  '/materia/:idMateria/periodo/:idPeriodo',
  obtenerAsistenciaDeTodosLosCursos
);

export default router;

import express from 'express';

import {
  getAsistenciaPorClase,
  getDatosDeCurso,
} from '../services/cursosService';

const router = express.Router();

router.get('/:id', getDatosDeCurso);
router.get('/:id/asistenciaPorClase', getAsistenciaPorClase);

export default router;

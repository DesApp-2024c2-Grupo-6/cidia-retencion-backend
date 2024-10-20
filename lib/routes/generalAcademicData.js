import express from 'express';
import {
  obtenerGeneralAcademicData,
  actualizarGeneralAcademicData,
} from '../controllers/generalAcademicData.controller';

const router = express.Router();

router.get('/', obtenerGeneralAcademicData);
router.put('/', actualizarGeneralAcademicData);

export default router;

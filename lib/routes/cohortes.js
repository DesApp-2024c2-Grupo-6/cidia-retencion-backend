import express from 'express';

import { obtenerCohorteCarrera, obtenerCohorteMateria } from '../controllers/cohortes.controller';

const router = express.Router();

router.get('/carrera/:idCarrera/periodo/:idPeriodo', obtenerCohorteCarrera);
router.get('/carrera/:idCarrera/periodo/:idPeriodo/materia/:idMateria', obtenerCohorteMateria);


export default router;

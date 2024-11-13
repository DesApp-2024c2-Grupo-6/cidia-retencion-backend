import express from 'express';
import {
  crearCarrera,
  obtenerCarrera,
  actualizarCarrera,
  obtenerTodasLasCarreras,
  eliminarCarrera,
  obtenerTodasLasCarrerasGuarani,
  obtenerTodasLasCarrerasGuaraniConPlanes,
  obtenerTodasLasCarrerasConPlanes,
  obtenerCarreraConPlan,
} from '../controllers/carreras.controller';

const router = express.Router();

router.get('/siu', obtenerTodasLasCarrerasGuarani);
router.get('/siu/conPlanes', obtenerTodasLasCarrerasGuaraniConPlanes);
router.get('/conPlanes', obtenerTodasLasCarrerasConPlanes);
router.get('/', obtenerTodasLasCarreras);
router.post('/', crearCarrera);
router.get('/:id', obtenerCarrera);
router.put('/:id', actualizarCarrera);
router.delete('/:id', eliminarCarrera);
router.get('/:id/plan/:planId', obtenerCarreraConPlan);

export default router;

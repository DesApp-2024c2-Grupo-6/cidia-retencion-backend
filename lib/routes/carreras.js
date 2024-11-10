import express from 'express';
import {
  crearCarrera,
  obtenerCarrera,
  actualizarCarrera,
  obtenerTodasLasCarreras,
  eliminarCarrera,
  obtenerTodasLasCarrerasGuarani,
  obtenerTodasLasCarrerasConPlanes,
} from '../controllers/carreras.controller';

const router = express.Router();

router.get('/siu', obtenerTodasLasCarrerasGuarani);
router.get('/conPlanes', obtenerTodasLasCarrerasConPlanes);
router.get('/', obtenerTodasLasCarreras);
router.post('/', crearCarrera);
router.get('/:id', obtenerCarrera);
router.put('/:id', actualizarCarrera);
router.delete('/:id', eliminarCarrera);

export default router;

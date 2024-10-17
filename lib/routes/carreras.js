import express from 'express';
import {
  crearCarrera,
  obtenerCarrera,
  actualizarCarrera,
  obtenerTodasLasCarreras,
  eliminarCarrera,
  obtenerTodasLasCarrerasGuarani,
} from '../controllers/carreras.controller';

const router = express.Router();

router.get('/siu', obtenerTodasLasCarrerasGuarani);
router.post('/', crearCarrera);
router.get('/:id', obtenerCarrera);
router.put('/:id', actualizarCarrera);
router.delete('/:id', eliminarCarrera);
router.get('/', obtenerTodasLasCarreras);

export default router;

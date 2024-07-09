import express from 'express';
import {
  crearCarrera,
  obtenerCarrera,
  actualizarCarrera,
  obtenerTodasLasCarreras,
  eliminarCarrera,
} from '../controllers/carreras.controller';

const router = express.Router();

router.post('/', crearCarrera);
router.get('/', obtenerCarrera);
router.put('/', actualizarCarrera);
router.delete('/', eliminarCarrera);
router.get('/all', obtenerTodasLasCarreras);

export default router;

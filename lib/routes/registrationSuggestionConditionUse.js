import express from 'express';
import {
  crearCondicionesCarrera,
  obtenerCondicionesCarrera,
  eliminarCondicionesCarrera,
} from '../controllers/registrationSuggestionConditionUse.controller';

const router = express.Router();

router.post('/', crearCondicionesCarrera);
router.get('/', obtenerCondicionesCarrera);
//router.put('/:id',actualizarCondicionesCarrera);
router.delete('/:id', eliminarCondicionesCarrera);

export default router;

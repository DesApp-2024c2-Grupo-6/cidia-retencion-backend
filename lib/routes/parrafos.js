import express from 'express';
import {
  updateOneParrafo,
  getAllParrafos,
  createParrafo,
  deleteOneParrafo,
  eliminarLista,
} from '../controllers/parrafo.controller';
import { withErrorHandling } from './utils';

const router = express.Router();

// Actualizar un párrafo existente por ID
router.put('/:id', withErrorHandling(updateOneParrafo));

// Obtener todos los párrafos
router.get('/', withErrorHandling(getAllParrafos));

// Crear un nuevo párrafo
router.post('/', withErrorHandling(createParrafo));

// Eliminar un párrafo por ID

router.delete('/:id', withErrorHandling(deleteOneParrafo));
router.delete('/del', withErrorHandling(eliminarLista));
export default router;

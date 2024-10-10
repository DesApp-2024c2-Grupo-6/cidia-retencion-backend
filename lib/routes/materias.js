import express from 'express';
import {
  agregarMateria,
  obtenerTodasLasMaterias,
  actualizarMateria,
  obtenerMateriasDeUnaCarrera,
  eliminarMateria,
  obtenerMateriasSinRegistrarDeUnaCarrera,
} from '../controllers/materias.controller';

const router = express.Router();

router.get('/', obtenerTodasLasMaterias);
router.put('/:id', actualizarMateria);
router.get('/:id', obtenerMateriasDeUnaCarrera);
router.delete('/:id', eliminarMateria);
router.post('/', agregarMateria); //fuera de alcance.
router.get('/:id/sin_registrar', obtenerMateriasSinRegistrarDeUnaCarrera);
export default router;

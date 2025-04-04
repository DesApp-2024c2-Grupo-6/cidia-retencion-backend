import express from 'express';
import {
  agregarMateria,
  obtenerTodasLasMaterias,
  obtenerMateriasMock,
  actualizarMateria,
  obtenerMateriasDeUnaCarrera,
  eliminarMateria,
  obtenerMateriasSinRegistrarDeUnaCarrera,
  obtenerMateriasDeUnPlanDeCarrera,
  obtenerMateriasDeUnaCarreraYPeriodo,
} from '../controllers/materias.controller';

const router = express.Router();

router.get('/', obtenerTodasLasMaterias);
router.get('/siu', obtenerMateriasMock);
router.get('/:id/idCareer/:idPlan/plan', obtenerMateriasDeUnPlanDeCarrera);
router.put('/:id', actualizarMateria);
router.get('/:id', obtenerMateriasDeUnaCarrera);
router.delete('/:id', eliminarMateria);
router.post('/', agregarMateria); //fuera de alcance.
router.get(
  '/:idCareer/plan/:idPlan/sin_registrar',
  obtenerMateriasSinRegistrarDeUnaCarrera
);
router.get('/:idCareer/cursos/:idPeriodo', obtenerMateriasDeUnaCarreraYPeriodo);
export default router;

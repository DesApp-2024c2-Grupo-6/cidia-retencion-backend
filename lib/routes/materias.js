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
  obtenerTodasLasMateriasDeUnaCarrera,
} from '../controllers/materias.controller';

const router = express.Router();

router.get('/', obtenerTodasLasMaterias);
router.get('/siu', obtenerMateriasMock);
router.get('/career/:id/plan/:idPlan', obtenerMateriasDeUnPlanDeCarrera);
router.put('/:id', actualizarMateria);
router.get('/:id', obtenerMateriasDeUnaCarrera);
router.delete('/:id', eliminarMateria);
router.post('/', agregarMateria); //fuera de alcance.
router.get(
  '/career/:idCareer/plan/:idPlan/sin_registrar',
  obtenerMateriasSinRegistrarDeUnaCarrera
);
router.get('/:idCareer/cursos/:idPeriodo', obtenerMateriasDeUnaCarreraYPeriodo);
router.get('/:idCareer/todas', obtenerTodasLasMateriasDeUnaCarrera);

export default router;

import express from 'express';
import { 
    agregarMateria,
    obtenerTodasLasMaterias,
    actualizarMateria,
    obtenerMateriasDeUnaCarrera,
    eliminarMateria
 } from '../controllers/materias.controller';

const router = express.Router();

router.get('/', obtenerTodasLasMaterias);
router.put('/', actualizarMateria);
router.get('/porcarrera', obtenerMateriasDeUnaCarrera);
router.delete('/', eliminarMateria);
router.post('/', agregarMateria) //fuera de alcance.
export default router;

import express from 'express';
import { 
        crearCarrera, 
        obtenerCarrera , 
        actualizarCarrera, 
        obtenerTodasLasCarreras,
        eliminarCarrera } from '../controllers/carreras.controller';
import { withErrorHandling } from './utils';

const router = express.Router();

router.post('/', crearCarrera);
router.get('/', obtenerCarrera);
router.put('/',actualizarCarrera);
router.get('/all', obtenerTodasLasCarreras);
router.delete('/', eliminarCarrera);

export default router;

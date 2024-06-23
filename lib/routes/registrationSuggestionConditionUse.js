import express from 'express';
import { 
        crearCondicionesCarrera, 
        obtenerCondicionesCarrera , 
        actualizarCondicionesCarrera, 
        eliminarCondicionesCarrera } from '../controllers/registrationSuggestionConditionUse.controller';

const router = express.Router();

router.post('/', crearCondicionesCarrera);
router.get('/', obtenerCondicionesCarrera);
//router.put('/',actualizarCondicionesCarrera);
router.delete('/', eliminarCondicionesCarrera);

export default router;
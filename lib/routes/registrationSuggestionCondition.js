import express from 'express';
import { obtenerCondicionesSugerencia } from '../controllers/registrationSuggestionCondition.controller';

const router = express.Router();

router.get('/', obtenerCondicionesSugerencia);

export default router;
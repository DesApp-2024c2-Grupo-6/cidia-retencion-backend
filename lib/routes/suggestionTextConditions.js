import express from 'express';
import { obtenerTextosSugerencia } from '../controllers/suggestionTextConditions.controller';

const router = express.Router();

router.get('/', obtenerTextosSugerencia);

export default router;
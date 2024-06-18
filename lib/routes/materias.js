import express from 'express';
import { obtenerTodasLasMaterias } from '../controllers/materias.controller';

const router = express.Router();

router.get('/', obtenerTodasLasMaterias);

export default router;

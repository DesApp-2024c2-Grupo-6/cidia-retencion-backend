import express from 'express';
import ciudades from './ciudades';
import eventos from './eventos';
import carreras from './carreras';
import parrafos from './parrafos';
const router = express.Router();

router.use('/api/ciudades', ciudades);
router.use('/api/eventos', eventos);

router.use('/api/carreras', carreras);
router.use('/api/parrafos', parrafos);
export default router;

import express from 'express';
// import ciudades from './ciudades';
// import eventos from './eventos';
import carreras from './carreras';
import materias from './materias';
import registrationSuggestionCondition from './registrationSuggestionCondition';
const router = express.Router();

// router.use('/api/ciudades', ciudades);
// router.use('/api/eventos', eventos);

router.use('/api/carreras', carreras);
router.use('/api/materias', materias);
router.use('/api/suggestionCondition', registrationSuggestionCondition);
export default router;

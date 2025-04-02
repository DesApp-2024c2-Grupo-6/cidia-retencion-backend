import express from 'express';
import carreras from './carreras';

import parrafos from './parrafos';

import materias from './materias';
import registrationSuggestionCondition from './registrationSuggestionCondition';
import suggestionTextConditions from './suggestionTextConditions';
import registrationSuggestionConditionUse from './registrationSuggestionConditionUse';
import generalAcademicData from './generalAcademicData';

import cursos from './cursos';

import periodosLectivos from './periodosLectivos';

const router = express.Router();

router.use('/api/carreras', carreras);

router.use('/api/parrafos', parrafos);

router.use('/api/materias', materias);
router.use('/api/suggestioncondition', registrationSuggestionCondition);
router.use('/api/suggestiontextconditions', suggestionTextConditions);
router.use(
  '/api/registrationsuggestionconditionuse',
  registrationSuggestionConditionUse
);

router.use(
  '/api/registrationsuggestionconditionuse',
  registrationSuggestionConditionUse
);

router.use('/api/generalAcademicData', generalAcademicData);

router.use('/api/cursos', cursos);

router.use('/api/periodosLectivos', periodosLectivos);

export default router;

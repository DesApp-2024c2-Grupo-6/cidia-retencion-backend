import express from 'express';
import carreras from './carreras';

import parrafos from './parrafos';

import materias from './materias';
import registrationSuggestionCondition from './registrationSuggestionCondition';
import suggestionTextConditions from './suggestionTextConditions';
import registrationSuggestionConditionUse from './registrationSuggestionConditionUse';

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

export default router;

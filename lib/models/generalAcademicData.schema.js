const mongoose = require('mongoose');
const { Schema } = mongoose;

export const paresCarreras = {
  shortCareer: { id: { type: Number } },
  longCareer: { id: { type: Number } },
};

export const materiasEspeciales = {
  id: { type: Number },
  name: { type: String },
};

export const GeneralAcademicDataSchema = new Schema(
  {
    careerPairs: [paresCarreras],

    fakeSubjectIds: { type: [Number] },

    specialSubjects: [materiasEspeciales],

    englishLevelIds: { type: [Number] },
  },
  { collection: 'GeneralAcademicData' }
);

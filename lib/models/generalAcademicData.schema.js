import mongoose from 'mongoose';

export const paresCarreras = {
  shortCareer: { id: { type: Number } },
  longCareer: { id: { type: Number } },
};

export const materiasEspeciales = {
  id: { type: Number },
  name: { type: String },
};

export const GeneralAcademicDataSchema = new mongoose.Schema(
  {
    careerPairs: [paresCarreras],

    fakeSubjectIds: { type: [Number] },

    specialSubjects: [materiasEspeciales],

    englishLevelIds: { type: [Number] },
  },
  { collection: 'GeneralAcademicData' }
);

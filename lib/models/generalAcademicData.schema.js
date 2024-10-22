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
    careerPairs: { type: [paresCarreras] },

    fakeSubjectIds: { type: [Number] },

    specialSubjects: { type: [materiasEspeciales] },

    englishLevelIds: { type: [Number] },
  },
  { collection: 'GeneralAcademicData' }
);

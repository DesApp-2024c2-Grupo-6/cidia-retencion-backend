import mongoose from 'mongoose';

export const condition = {
  cant: { type: Number },
  id_carreras: { type: [Number] },
  id_materias: { type: [Number] },
  condicion_en_carrera: { type: String },
};
export const sectionConditions = {
  codigo_condicion: { type: String },
  config_condicion: condition,
};

export const parrafoDataSchema = new mongoose.Schema(
  {
    textId: { type: String },
    _rawData: [
      {
        key: { type: String },
        text: { type: [String] },
        id_carreras: { type: [Number], default: undefined },
        conditions: [sectionConditions],
      },
    ],
  },
  { collection: 'SuggestionTextTemplate' }
);

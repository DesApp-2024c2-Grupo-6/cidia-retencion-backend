const mongoose = require('mongoose');
const { Schema } = mongoose;

export const subjectStatusSchema = new Schema(
  {
    alumno_id: { type: Number },
    cuatrimestre_id: { type: Number },
    carrera_id: { type: Number },
    status_materias: [
      {
        materia_id: { type: Number },
        clasificacion: { type: String },
        periodoReg: { type: Number },
        periodoApr: { type: Number },
        notaApr: { type: String },
        periodoUltimaCursada: { type: Number },
        cantidadCursadas: { type: Number },
      },
    ],
  },
  { collection: 'subjectstatusschemas' }
);

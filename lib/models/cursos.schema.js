import mongoose from 'mongoose';

export const assistance = {
  fecha: { type: String },
  hay_datos_asistencia: { type: Boolean },
  cant_presentes: { type: Number, required: false },
};

export const horario = {
  dia_semana: { type: String },
  hora_inicio: { type: String },
  hora_fin: { type: String },
};

export const mainData = {
  curso_id: { type: Number },
  nombre_curso: { type: String },
  nombre: { type: String },
  cantidad_inscriptos: { type: String },
  anio: { type: String },
  fecha_inicio: { type: String },
  fecha_fin: { type: String },
  cuatrimestre: { type: String },
  horarios: [horario],
};

export const CourseDataSchema = new mongoose.Schema({
  assistance,
  mainData,
});

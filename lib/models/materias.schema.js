const mongoose = require('mongoose');
const { Schema } = mongoose;

export const subjectsSchema = new Schema({
    id_materia: { type : Number },
    id_carrera: { type : Number },
    anio: { type: Number },
    campo: { type: String },
    specialSubjectName: { type: String}
},{ collection: "SubjectData"});

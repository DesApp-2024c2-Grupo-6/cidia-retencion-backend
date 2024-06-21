const mongoose = require('mongoose');
const { Schema } = mongoose;

export const RegistrationSuggestionConditionSchema = new Schema({
    codigo: { type: String },
    descripcion: { type: String },
    parametros: [{ nombre: String, tipo: String, descripcion: String }]
}, { collection: "RegistrationSuggestionCondition" });
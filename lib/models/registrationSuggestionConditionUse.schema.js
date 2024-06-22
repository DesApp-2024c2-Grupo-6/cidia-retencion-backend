import mongoose from "mongoose";

export const RegistrationSuggestionConditionUseSchema = new mongoose.Schema({
    id_carrera: { type: Number },
    id_materia: { type: Number },
    anio: { type: Number },
    campo: { type: String },
    codigo_condicion: { type: String },
    config_condicion: mongoose.Schema.Types.Mixed
}, { collection: "RegistrationSuggestionConditionUse" });

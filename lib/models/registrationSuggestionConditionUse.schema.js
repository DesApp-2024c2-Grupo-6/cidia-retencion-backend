import mongoose from "mongoose";

export const RegistrationSuggestionConditionUseSchema = new mongoose.Schema({
    id_carrera: { type: Number },
    id_materia: { type: Number, required: false },
    anio: { type: Number, required: false },
    campo: { type: String, required: false },
    codigo_condicion: { type: String, required: true },
    config_condicion: mongoose.Schema.Types.Mixed
}, { collection: "RegistrationSuggestionConditionUse" });

import mongoose from 'mongoose';


export const infoDeUnaMateria = { year: { type: Number }, campo: { type: String } };

export const CareerDataSchema = new mongoose.Schema({
    careerId: { type: Number },
    unahurSubjects: [infoDeUnaMateria],
    englishLevels: [infoDeUnaMateria],
    suggestionThresholdRegularizedSubjects: { type: Number, required: false },
    specialCareerName: { type: String, required: false },
    minimumSubjectsRecommended: { type: Number, required: false }, 
}, { collection: "CareerData" });

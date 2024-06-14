import mongoose from 'mongoose';


export const infoDeUnaMateria = { year: { type: Number }, campo: { type: String } };

export const CareerDataSchema = new mongoose.Schema({
    careerId: { type: Number },
    unahurSubjects: [infoDeUnaMateria],
    englishLevels: [infoDeUnaMateria],
    suggestionThresholdRegularizedSubjects: { type: Number },
    specialCareerName: { type: String },
    minimumSubjectsRecommended: { type: Number }, 
}, { collection: "CareerData" });

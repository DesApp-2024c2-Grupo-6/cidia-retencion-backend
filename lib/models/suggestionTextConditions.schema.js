const { Schema } = require('mongoose');

export const SuggestionTextConditionsSchema = new Schema({
    name: { type: String }
}, { collection: 'SuggestionTextConditions' });
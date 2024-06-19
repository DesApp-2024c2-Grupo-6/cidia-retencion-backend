import mongoose from "mongoose";
import { SuggestionTextConditionsSchema } from "../models/suggestionTextConditions.schema";

export async function obtenerTextosSugerencia(req,res) {
    try {
        const textSugConditionModel = mongoose.model('Textos', SuggestionTextConditionsSchema);
        const allSuggestionTextConditions = await textSugConditionModel.find();
        if(allSuggestionTextConditions.length > 0){
            res.status(200).json({allSuggestionTextConditions});
        }else{
            res.status(204).send();
        }
    } catch (error) {
        res.status(500).json({error: error})
    }
}
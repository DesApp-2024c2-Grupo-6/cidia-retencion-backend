import mongoose from "mongoose";
import { RegistrationSuggestionConditionSchema } from "../models/registrationSuggestionCondition.schema";

export async function obtenerCondicionesSugerencia(req,res) {
    try {
        const regSugConditionModel = mongoose.model('Condicion', RegistrationSuggestionConditionSchema);
        const allSuggestionConditions = await regSugConditionModel.find();
        if(allSuggestionConditions.length > 0){
            res.status(200).json({allSuggestionConditions});
        }else{
            res.status(204).send();
        }
    } catch (error) {
        res.status(500).json({error: error})
    }
}


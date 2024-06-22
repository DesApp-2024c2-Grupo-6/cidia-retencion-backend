import mongoose from "mongoose";
import { RegistrationSuggestionConditionUseSchema } from "../models/registrationSuggestionConditionUse.schema";

//TODO crear condiciones carrera.
export async function crearCondicionesCarrera(req, res) {
        try{
                const carrerModel = mongoose.model('CondicionesCarrera', RegistrationSuggestionConditionUseSchema);
                const {
                        careerId,
                        unahurSubjects,
                        englishLevels,
                        suggestionThresholdRegularizedSubjects,
                        specialCareerName,
                        minimumSubjectsRecommended
                } = req.body;
            
                const nuevaCarrera = new carrerModel({ 
                        careerId: Number(careerId),
                        unahurSubjects,
                        englishLevels,
                        suggestionThresholdRegularizedSubjects: Number(suggestionThresholdRegularizedSubjects),
                        specialCareerName,
                        minimumSubjectsRecommended: Number(minimumSubjectsRecommended)
                });
                await nuevaCarrera.save();
                res.status(200).json(nuevaCarrera);
        }catch(error){
                res.status(500).json({error})
        }
};

/**
 * Obtener las condiciones adicionales de una Carrera.
 * @param {id_carrera} req id de carrera
 * @param {*} res devuelve un objeto con los datos de las condiciones de una carrera sino vacío.
 */

export async function obtenerCondicionesCarrera(req,res) {
        try{
            const conditionsCareerModel = mongoose.model('CondicionesCarrera', RegistrationSuggestionConditionUseSchema);
            const filtro = {}
            if(req.query.id_carrera){
                filtro.id_carrera = req.query.id_carrera;
            }
            const conditionsCareerData = await conditionsCareerModel.find(filtro); //Devuelve un array .find()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
            if(conditionsCareerData){
                res.status(200).json({conditionsCareerData});
            }else{
                res.status(204).send();
            }
        }catch(error){
                res.status(500).json({error})
        }
}
// NO ESTA EN EL ALCANCE el UPDATE.
export async function actualizarCarrera(req,res) {

        
}

//TODO eliminar condiciones de 1 carrera.
export async function eliminarCarrera(req,res) {
        try{
                const carrerModel = mongoose.model('Carrera', CareerDataSchema);
                const filtro = {careerId: Number(req.query.careerId)};
                console.log(filtro)
                const eliminadaCarrera = await carrerModel.findOneAndDelete(filtro);
                if(eliminadaCarrera){
                        res.status(200).json({eliminadaCarrera})
                }else{
                        res.status(204).send();
                }
        }catch(error){
                res.status(500).json({error})
        }


}

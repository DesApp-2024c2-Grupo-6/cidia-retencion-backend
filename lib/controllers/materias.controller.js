import mongoose from "mongoose";
import { subjectsSchema } from "../models/materias.schema";

export async function obtenerTodasLasMaterias(req,res) {
    try {
        const subjectModel = mongoose.model('Materia', subjectsSchema);
            const todasLasMaterias = await subjectModel.find();
            if(todasLasMaterias){
                res.status(200).json({todasLasMaterias});
            }else{
                res.status(404).json({error: `No hay datos de Materias`});
            }
    } catch (error) {
        res.status(500).json({error: error})
    }
}
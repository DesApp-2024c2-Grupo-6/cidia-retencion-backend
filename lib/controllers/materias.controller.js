import mongoose from "mongoose";
import { subjectsSchema } from "../models/materias.schema";

export async function obtenerTodasLasMaterias(req,res) {
    try {
        const subjectModel = mongoose.model('Materia', subjectsSchema);
            const allSubjects = await subjectModel.find();
            if(allSubjects.length > 0){
                res.status(200).json({allSubjects});
            }else{
                res.status(204).send();
            }
    } catch (error) {
        res.status(500).json({error: error})
    }
}
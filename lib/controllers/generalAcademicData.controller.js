import mongoose from 'mongoose';
import { GeneralAcademicDataSchema } from '../models/generalAcademicData.schema';
//import { getAllSubj } from '../services/materiasService';

/**
 * Entrada: Ninguna
 * Salida: GeneralAcademicData
 */
export async function obtenerGeneralAcademicData(req, res) {
  try {
    const generalAcademicDataModel = mongoose.model(
      'GeneralAcademicData',
      GeneralAcademicDataSchema
    );
    //console.log(await generalAcademicDataModel.collection.findOne());
    const datosAcademicos = await generalAcademicDataModel.find();
    // const materias = await getAllSubj();
    // const datosConNombresDeMaterias = datosAcademicos.specialSubjects.array.map((materia) => {
    //   const materiaMock = materias.data.find(
    //     (materiaMock) => materiaMock['id'] == materia['id']
    //   );
    //   materia.realName = materiaMock.nombre;
    //   return materia;
    // });
    // console.log(datosConNombresDeMaterias);
    // datosAcademicos.specialSubjects = datosConNombresDeMaterias;
    //console.log(datosAcademicos);
    if (datosAcademicos) {
      res.status(200).json({ datosAcademicos });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}

/**
 * Entrada: Nuevos valores en body
 * Salida: generalAcademicData actualizada
 */
export async function actualizarGeneralAcademicData(req, res) {
  try {
    const generalAcademicDataModel = mongoose.model(
      'GeneralAcademicData',
      GeneralAcademicDataSchema
    );
    const {
      careerPairs,
      fakeSubjectIds,
      specialSubjects,
      englishLevelIds,
    } = req.body;
    //console.log(req.body);
    const updatedData = await generalAcademicDataModel.findOneAndUpdate({
      careerPairs,
      fakeSubjectIds,
      specialSubjects,
      englishLevelIds,
    });
    if (updatedData) {
      res.status(200).json({ updatedData });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}

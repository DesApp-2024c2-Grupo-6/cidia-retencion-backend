import mongoose from 'mongoose';
import { GeneralAcademicDataSchema } from '../models/generalAcademicData.schema';

/**
 * Entrada: Ninguna
 * Salida: GeneralAcademicData
 */
export async function obtenerGeneralAcademicData(_req, res) {
  try {
    const generalAcademicDataModel = mongoose.model(
      'DatosGenerales',
      GeneralAcademicDataSchema
    );
    const datosAcademicos = await generalAcademicDataModel.findOne();
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

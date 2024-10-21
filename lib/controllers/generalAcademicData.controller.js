import mongoose from 'mongoose';
import { GeneralAcademicDataSchema } from '../models/generalAcademicData.schema';

/**
 * Entrada: Ninguna
 * Salida:
 */
export async function obtenerGeneralAcademicData(req, res) {
  try {
    const generalAcademicDataModel = mongoose.model(
      'DatosGenerales',
      GeneralAcademicDataSchema
    );
    const datosAcademicos = await generalAcademicDataModel.find();
    console.log(datosAcademicos);
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
// export async function actualizarGeneralAcademicData(req, res) {
//   try {
//     const generalAcademicDataModel = mongoose.model('GeneralAcademicData', GeneralAcademicDataSchema);
//     const {
//       careerPairs,
//       fakeSubjectIds,
//       specialSubjects,
//       englishLevelIds
//     } = req.body;

//   } catch (error) {
//     res.status(500).json({ error });
//   }
// }

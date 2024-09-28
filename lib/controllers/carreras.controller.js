import mongoose from 'mongoose';
import { CareerDataSchema } from '../models/carreras.schema';
import { validarCampo } from './utils.controller';
//import { getAllCarreras } from '../services/carrerasService';

//por el contexto de la app es posible que este metodo no lo use desde el FE.
export async function crearCarrera(req, res) {
  try {
    const carrerModel = mongoose.model('Carrera', CareerDataSchema);
    const {
      careerId,
      unahurSubjects,
      englishLevels,
      suggestionThresholdRegularizedSubjects,
      specialCareerName,
      minimumSubjectsRecommended,
    } = req.body;

    const nuevaCarrera = new carrerModel({
      careerId: validarCampo(careerId),
      unahurSubjects,
      englishLevels,
      suggestionThresholdRegularizedSubjects: validarCampo(
        suggestionThresholdRegularizedSubjects
      ),
      specialCareerName: validarCampo(specialCareerName),
      minimumSubjectsRecommended: validarCampo(minimumSubjectsRecommended),
    });
    await nuevaCarrera.save();
    res.status(200).json(nuevaCarrera);
  } catch (error) {
    res.status(500).json({ error });
  }
}
/**
 * Obtener datos de 1 Carrera.
 * @param {careerId} req id de carrera
 * @param {*} res devuelve un objeto con el dato de la carrera encontrado sino vacío.
 */
export async function obtenerCarrera(req, res) {
  try {
    const carrerModel = mongoose.model('Carrera', CareerDataSchema);
    //en filtro agrego el objeto por el cual filtrar tiene q ser el mismo campo del documento
    const filtro = {};
    if (req.query.careerId) {
      filtro.careerId = req.query.careerId;
    }
    const searchData = await carrerModel.find(filtro); //Devuelve un array .find()
    const careerData = searchData[0];
    //res.json({careerData})
    if (careerData) {
      res.status(200).json({ careerData });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}

export async function actualizarCarrera(req, res) {
  try {
    const carrerModel = mongoose.model('Carrera', CareerDataSchema);
    const {
      careerId,
      unahurSubjects,
      englishLevels,
      suggestionThresholdRegularizedSubjects,
      specialCareerName,
      minimumSubjectsRecommended,
    } = req.body;
    const filtro = { careerId: careerId };
    const objCarrera = {
      careerId: Number(careerId),
      unahurSubjects,
      englishLevels,
      suggestionThresholdRegularizedSubjects:
        suggestionThresholdRegularizedSubjects !== undefined
          ? suggestionThresholdRegularizedSubjects
          : undefined,
      specialCareerName,
      minimumSubjectsRecommended:
        minimumSubjectsRecommended !== undefined
          ? minimumSubjectsRecommended
          : undefined,
    };
    const updateCareer = await carrerModel.findOneAndUpdate(filtro, objCarrera);
    console.log(updateCareer);
    if (updateCareer) {
      res.status(200).json({ updateCareer });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}

export async function obtenerTodasLasCarreras(req, res) {
  try {
    const carrerModel = mongoose.model('Carrera', CareerDataSchema);
    const allCareers = await carrerModel.find();
    /**
     * const carrerasMock = await getAllCarreras();
     * const carrerasCompletas = allCareers.map(carrera => {
     *  const carreraMock = carrerasMock.find(c => c.id === carrera.careerId);
     *  carrera.specialCareerName = carreraMock.nombre
     * return {...carrera}
     * })
     *
     */
    if (allCareers) {
      res.status(200).json({ allCareers });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}

export async function eliminarCarrera(req, res) {
  try {
    const carrerModel = mongoose.model('Carrera', CareerDataSchema);
    const filtro = { careerId: Number(req.query.careerId) };
    console.log(filtro);
    const eliminadaCarrera = await carrerModel.findOneAndDelete(filtro);
    if (eliminadaCarrera) {
      res.status(200).json({ eliminadaCarrera });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}

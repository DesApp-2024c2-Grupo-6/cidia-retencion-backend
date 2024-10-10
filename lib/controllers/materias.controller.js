import mongoose from 'mongoose';
import { subjectsSchema } from '../models/materias.schema';
import { validarCampo } from './utils.controller';
import { getSubj } from '../services/materiasService';

/**
 * Entrada: Ninguna
 * Salida: Conjunto de todas las materias
 */
export async function obtenerTodasLasMaterias(req, res) {
  try {
    const subjectModel = mongoose.model('Materia', subjectsSchema);
    const allSubjects = await subjectModel.find();
    if (allSubjects.length > 0) {
      res.status(200).json({ allSubjects });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

/**
 * Entrada: Id de una carrera en query
 * Salida: Materias asociadas con la carrera
 */
export async function obtenerMateriasDeUnaCarrera(req, res) {
  try {
    const subjectModel = mongoose.model('Materia', subjectsSchema);
    // let filtro = {};
    // const { id_carrera } = req.query;
    // filtro.id_carrera = id_carrera;
    const idCarrera = req.params.id;
    const subjectsByCareer = await subjectModel.find({ id_carrera: idCarrera });
    const materiasPorCarrera = await getSubj(idCarrera);

    const materiasCompletas = subjectsByCareer.map((materia) => {
      if (materia.id_materia != undefined) {
        const materiaMock = materiasPorCarrera.data.find(
          (materiaMock) => materiaMock['id'] == materia['id_materia']
        );
        if (materiaMock != undefined) {
          materia.subjectName = materiaMock.nombre;
        }
      }
      return materia;
    });

    if (materiasCompletas.length > 0) {
      res.status(200).json({ subjectsByCareer: materiasCompletas });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

/**
 * Entrada: Nuevos valores para los atributos de la materia en body
 * Salida: Datos de carrera actualizados en el backend
 */
export async function actualizarMateria(req, res) {
  try {
    const subjectModel = mongoose.model('Materia', subjectsSchema);
    const {
      id_carrera,
      id_materia,
      anio,
      campo,
      specialSubjectName,
    } = req.body;
    const filtro = { id_carrera: id_carrera, id_materia: id_materia };
    const updateSubject = {
      id_carrera: validarCampo(id_carrera),
      id_materia: validarCampo(id_materia),
      anio: validarCampo(anio),
      campo: validarCampo(campo),
      specialSubjectName: validarCampo(specialSubjectName),
    };
    const upSubject = await subjectModel.findOneAndUpdate(
      filtro,
      updateSubject
    );
    if (upSubject) {
      res.status(200).json({ upSubject });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

/**
 * Entrada: Id de materia y carrera
 * Salida: Elimina materia por sus id
 */
export async function eliminarMateria(req, res) {
  try {
    const subjectModel = mongoose.model('Materia', subjectsSchema);
    const filtro = {
      id_carrera: validarCampo(req.body.id_carrera),
      id_materia: validarCampo(req.body.id_materia),
    };
    console.log(filtro);
    const deletedSubject = await subjectModel.findOneAndDelete(filtro);
    if (deletedSubject) {
      res.status(200).json({ deletedSubject });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

//Este metodo no se usara desde el FE.
/**
 * Entrada: Datos de materia nueva en body
 * Salida: Materia agregada al backend
 */
export async function agregarMateria(req, res) {
  try {
    const subjectModel = mongoose.model('Materia', subjectsSchema);
    const {
      id_carrera,
      id_materia,
      anio,
      campo,
      specialSubjectName,
    } = req.body;
    const filtro = {
      id_carrera: validarCampo(id_carrera),
      id_materia: validarCampo(id_materia),
    };
    const existsSubject = await subjectModel.find(filtro);
    if (existsSubject.length === 0) {
      const newSubject = new subjectModel({
        id_carrera: validarCampo(id_carrera),
        id_materia: validarCampo(id_materia),
        anio: validarCampo(anio),
        campo: validarCampo(campo),
        specialSubjectName: validarCampo(specialSubjectName),
      });
      await newSubject.save();
      res.status(200).json(newSubject);
    } else {
      res.status(404).json({
        msg: `Materia ${id_materia} en Carrera ${id_carrera} existente.`,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

/**
 * Entrada: Id de carrera en params
 * Salida: Conjunto de materias sin registrar en el backend de esa carrera
 */
export async function obtenerMateriasSinRegistrarDeUnaCarrera(req, res) {
  try {
    const subjectModel = mongoose.model('Materia', subjectsSchema);
    const idCarrera = req.params.id;
    const subjectsByCareer = await subjectModel.find({ id_carrera: idCarrera });
    const idMateriaRegistrados = subjectsByCareer.map(
      (subject) => subject.id_materia
    );
    const materiasMock = await getSubj(idCarrera);

    const materiasSinRegistrar = materiasMock.data.filter(
      (materiaMock) => !idMateriaRegistrados.includes(materiaMock.id)
    );

    if (materiasSinRegistrar.length > 0) {
      res.status(200).json({ materiasSinRegistrar });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
}

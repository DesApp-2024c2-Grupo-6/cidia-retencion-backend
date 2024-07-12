import mongoose from 'mongoose';
import { subjectsSchema } from '../models/materias.schema';
import { validarCampo } from './utils.controller';

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

export async function obtenerMateriasDeUnaCarrera(req, res) {
  try {
    const subjectModel = mongoose.model('Materia', subjectsSchema);
    let filtro = {};
    const { id_carrera } = req.query;
    filtro.id_carrera = id_carrera;
    const subjectsByCareer = await subjectModel.find(filtro);
    if (subjectsByCareer.length > 0) {
      res.status(200).json({ subjectsByCareer });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

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

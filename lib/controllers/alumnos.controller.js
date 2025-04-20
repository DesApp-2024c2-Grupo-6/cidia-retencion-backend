import mongoose from 'mongoose';
import { getAlumnos, postAlumnosData } from '../services/alumnosService';
import { subjectStatusSchema } from '../models/alumnos.schema';

/**
 * Entrada: Id de carrera
 * Salida: Array con los Ids de alumnos de la carrera o array vacio si Id es invalido
 */
export async function obtenerAlumnos(req, res) {
  try {
    const alumnos = await getAlumnos(req.params.id);
    if (alumnos) {
      res.status(200).json(alumnos.data);
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

/**
 * Entrada: Array de Ids de alumnos
 * Salida: Array de objetos alumnos
 */
export async function obtenerDatosDeAlumnos(req, res) {
  try {
    const datosAlumnos = await postAlumnosData(req.body);
    if (datosAlumnos) {
      res.status(200).json(datosAlumnos.data);
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

/**
 * Entrada: Id de cuatrimestre
 * Salida: Array con objetos subjectStatusSchema
 */
export async function obtenerAlumnosPorCuatrimestre(req, res) {
  try {
    const subjectStatusModel = mongoose.model(
      'Estudiante',
      subjectStatusSchema
    );
    const subjects = await subjectStatusModel.find({
      cuatrimestre_id: req.params.id,
    });
    if (subjects) {
      res.status(200).json(subjects);
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

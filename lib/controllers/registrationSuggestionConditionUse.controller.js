import mongoose from 'mongoose';
import { RegistrationSuggestionConditionUseSchema } from '../models/registrationSuggestionConditionUse.schema';
import { validarCampo, construirFiltro } from './utils.controller';

export async function crearCondicionesCarrera(req, res) {
  try {
    const conditionsCareerModel = mongoose.model(
      'CondicionesCarrera',
      RegistrationSuggestionConditionUseSchema
    );
    const {
      id_carrera,
      id_materia,
      anio,
      codigo_condicion,
      config_condicion,
    } = req.body;

    const newCondition = new conditionsCareerModel({
      id_carrera: validarCampo(id_carrera),
      id_materia: validarCampo(id_materia),
      anio: validarCampo(anio),
      codigo_condicion: validarCampo(codigo_condicion),
      config_condicion: validarCampo(config_condicion),
    });
    await newCondition.save();
    res.status(200).json(newCondition);
  } catch (error) {
    res.status(500).json({ error });
  }
}

/**
 * Obtener las condiciones adicionales de una Carrera.
 * @param {id_carrera} req id de carrera
 * @param {*} res devuelve un objeto con los datos de las condiciones de una carrera sino vacío.
 */

export async function obtenerCondicionesCarrera(req, res) {
  try {
    const conditionsCareerModel = mongoose.model(
      'CondicionesCarrera',
      RegistrationSuggestionConditionUseSchema
    );
    const filtro = {};
    if (req.query.id_carrera) {
      filtro.id_carrera = req.query.id_carrera;
    }
    const conditionsCareerData = await conditionsCareerModel.find(filtro); //Devuelve un array .find()
    if (conditionsCareerData) {
      res.status(200).json({ conditionsCareerData });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}

export async function eliminarCondicionesCarrera(req, res) {
  try {
    const conditionsCareerModel = mongoose.model(
      'CondicionesCarrera',
      RegistrationSuggestionConditionUseSchema
    );
    let filtro = {};
    let freq = {
      id_carrera: validarCampo(req.query.id_carrera),
      codigo_condicion: validarCampo(req.query.codigo_condicion),
      id_materia: validarCampo(req.query.id_materia),
      anio: validarCampo(req.query.anio),
      config_condicion: validarCampo(req.query.config_condicion),
    };
    filtro = construirFiltro(freq);
    const deletedCondition = await conditionsCareerModel.findOneAndDelete(
      filtro
    );
    if (deletedCondition) {
      res.status(200).json({ deletedCondition });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}

// NO ESTA EN EL ALCANCE el UPDATE.

import axios from 'axios';

/*
Entrada: Ninguna
Salida: Todas las carreras
*/
export const getAllSubj = async () => {
  try {
    const response = await axios.get(
      `https://cidia-retencion-mock-api-guarani.onrender.com/materias/`
    );
    return response;
  } catch (error) {
    return error;
  }
};

/**
 * Entrada: Id de carrera e Id de plan de esa carrera
 * Salida: Materias pertenecientes al plan de esa carrera
 */
export const getSubjPlan = async (idCareer, idPlan) => {
  try {
    const response = await axios.get(
      `https://cidia-retencion-mock-api-guarani.onrender.com/carreras/${idCareer}/plan/${idPlan}/materias`
    );
    return response;
  } catch (error) {
    return error;
  }
};

/**
 * Entrada: Id de carrera
 * Salida: Materias de esa carrera
 */
export const getSubj = async (idCareer) => {
  try {
    const response = await axios.get(
      `https://cidia-retencion-mock-api-guarani.onrender.com/carreras/${idCareer}/materias`
    );
    return response;
  } catch (error) {
    return error;
  }
};

/**
 * Entrada: Id de carrera, Id de materia
 * Salida: Materia de esa carrera
 */
export const getMateria = async (idCareer, idMateria) => {
  try {
    const materias = await axios.get(
      `https://cidia-retencion-mock-api-guarani.onrender.com/carreras/${idCareer}/materias`
    );
    const response = materias.data.find((materia) => materia.id == idMateria);
    return { data: response };
  } catch (error) {
    return error;
  }
};

/**
 *
 * @param {*} id id de carrera
 * @param {*} idPeriodo  id de periodo para cursos
 * @returns Array con los cursos para esa carrera y periodo
 */
export const getCursos = async (idCareer, idPeriodo) => {
  try {
    const response = await axios.get(
      `https://cidia-retencion-mock-api-guarani.onrender.com/materias/${idCareer}/cursos/${idPeriodo}`
    );
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

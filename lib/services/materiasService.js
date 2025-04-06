import axios from 'axios';

/*
Entrada: Ninguna
Salida: Todas las carreras
*/
export const getAllSubj = async () => {
  try {
    const response = await axios.get(`http://localhost:4000/materias/`);
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
      `http://localhost:4000/carreras/${idCareer}/plan/${idPlan}/materias`
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
      `http://localhost:4000/carreras/${idCareer}/materias`
    );
    return response;
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
      `http://localhost:4000/materias/${idCareer}/cursos/${idPeriodo}`
    );
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

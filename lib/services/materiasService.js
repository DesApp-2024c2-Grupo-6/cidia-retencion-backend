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

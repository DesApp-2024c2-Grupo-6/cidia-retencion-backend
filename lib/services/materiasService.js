import axios from 'axios';

const baseURL = 'http://localhost:4000/carreras/:id/materias';

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
 * Entrada: ID de una carrera
 * Salida: Lista de materias de la carrera
 */
export const getSubj = async (id) => {
  try {
    const response = await axios.get(`${baseURL}/`, {
      params: { id: id },
    });
    return response;
  } catch (error) {
    return error;
  }
};

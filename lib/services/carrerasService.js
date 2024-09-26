import axios from 'axios';

const baseURL = 'http://localhost:4000/carreras';

/*
Entrada: Ninguna
Salida: Todas las carreras
*/
export const getAllCarreras = async () => {
  try {
    const response = await axios.get(`${baseURL}/`);
    return response;
  } catch (error) {
    return error;
  }
};

/**
 Entrada: ID de carrera
 Salida: JSON con datos de carrera
 */
export const getCarrera = async (careerId) => {
  try {
    const response = await axios.get(`${baseURL}/:id`, {
      params: { id: careerId },
    });
    return response;
  } catch (error) {
    return error;
  }
};

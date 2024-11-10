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
 * Entrada: Ninguna
 * Salida: Todas las carreras con sus planes de estudio
 */
export const getAllCarrerasConPlanes = async () => {
  try {
    const response = await axios.get(
      `http://localhost:4000/carreras/?incluirPlanes=si`
    );
    return response;
  } catch (error) {
    return error;
  }
};

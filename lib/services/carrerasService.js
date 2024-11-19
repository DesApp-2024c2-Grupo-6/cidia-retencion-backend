import axios from 'axios';

const baseURL =
  'https://cidia-retencion-mock-api-guarani.onrender.com/carreras';

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
      `https://cidia-retencion-mock-api-guarani.onrender.com/carreras/?incluirPlanes=si`
    );
    return response;
  } catch (error) {
    return error;
  }
};

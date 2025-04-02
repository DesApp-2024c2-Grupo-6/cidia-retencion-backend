import axios from 'axios';

/**
 * Entrada: Ninguna
 * Salida: Array con periodos lectivos
 */
export const getPeriodos = async () => {
  try {
    const response = await axios.get('http://localhost:4000/cuatrimestre');
    return response;
  } catch (error) {
    return error;
  }
};

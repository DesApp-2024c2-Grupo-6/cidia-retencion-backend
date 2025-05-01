import axios from 'axios';

/**
 * Entrada: Ninguna
 * Salida: Array con periodos lectivos
 */
export const getPeriodos = async () => {
  try {
    const response = await axios.get(
      'https://cidia-retencion-mock-api-guarani.onrender.com/cuatrimestre'
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const getPeriodo = async (id) => {
  try {
    const periodos = await axios.get(
      'https://cidia-retencion-mock-api-guarani.onrender.com/cuatrimestre'
    );
    const response = periodos.data.find((periodo) => periodo.periodoId == id);
    return { data: response };
  } catch (error) {
    return error;
  }
};

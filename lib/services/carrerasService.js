import axios from 'axios';

const baseURL = 'http://localhost:4000/carreras';

/*
Entrada: Ninguna
Salida: Todas las carreras
*/
export const getAllCarrer = async () => {
  try {
    const response = await axios.get(`${baseURL}/`);
    return response;
  } catch (error) {
    return error;
  }
};

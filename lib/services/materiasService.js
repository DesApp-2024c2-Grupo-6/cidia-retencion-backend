import axios from 'axios';

const baseURL = 'http://localhost:4000/carreras/:id/materias';

/*
Entrada: Ninguna
Salida: Todas las carreras
*/
export const getAllSubj = async () => {
  try {
    const response = await axios.get(`${baseURL}/`);
    return response;
  } catch (error) {
    return error;
  }
};

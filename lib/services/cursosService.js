import axios from 'axios';

const baseURL = 'http://localhost:4000/cursos';

/**
 * Entrada: Id de curso
 * Salida: Array con objetos
 *  o array vacio de no existir el curso
 */

export const getAsistenciaPorClase = async (idCurso) => {
  try {
    const response = await axios.get(
      `${baseURL}/${idCurso}/asistenciaPorClase`
    );
    return response;
  } catch (error) {
    return error;
  }
};

/**
 * Entrada: Id de curso
 * Salida: Objeto mainData u objeto vacio al no existir el curso
 */
export const getDatosDeCurso = async (id) => {
  try {
    const response = await axios.get(`${baseURL}/${id}`);
    return response;
  } catch (error) {
    return error;
  }
};

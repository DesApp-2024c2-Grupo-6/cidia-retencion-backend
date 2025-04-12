import axios from 'axios';

/**
 * Entrada: Id de carrera
 * Salida: Array con Id de alumnos de esa carrera o array vacio si el id es invalido
 */
export const getAlumnos = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:4000/alumnos/carrera/${id}`
    );
    return response;
  } catch (error) {
    return error;
  }
};

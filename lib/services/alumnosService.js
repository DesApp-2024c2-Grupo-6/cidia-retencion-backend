import axios from 'axios';

/**
 * Entrada: Id de carrera
 * Salida: Array con Id de alumnos de esa carrera o array vacio si el id es invalido
 */
export const getAlumnos = async (id) => {
  try {
    const response = await axios.get(
      `https://cidia-retencion-mock-api-guarani.onrender.com/alumnos/carrera/${id}`
    );
    return response;
  } catch (error) {
    return error;
  }
};

/**
 * Entrada: Array de Ids de alumno
 * Salida: Array de datos de alumnos con esos Ids
 */
export const postAlumnosData = async (alumnos) => {
  try {
    const response = await axios.post(
      `https://cidia-retencion-mock-api-guarani.onrender.com/alumnos/statusAcademico/masivo`,
      alumnos,
      {
        params: {
          includeStudentData: false,
          includeFirstPeriod: true,
        },
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

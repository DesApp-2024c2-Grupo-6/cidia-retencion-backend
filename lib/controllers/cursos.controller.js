import { getAsistenciaPorClase } from '../services/cursosService';
import { getDatosDeCurso } from '../services/cursosService';

/**
 * @param {*} req Id de curso
 * @param {*} res Informacion de curso u objeto vacio de no ser Id valido
 */
export async function obtenerCurso(req, res) {
  try {
    const curso = await getDatosDeCurso(req.params.id);
    console.log(curso);
    if (curso) {
      res.status(200).json(curso.data);
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

/**
 * @param {*} req Id de curso
 * @param {*} res Array con informacion de asistencias o array vacio de ser Id invalido
 */
export async function obtenerAsistenciasDeCurso(req, res) {
  try {
    const asistencias = await getAsistenciaPorClase(req.params.id);
    if (asistencias) {
      res
        .status(200)
        .json(
          asistencias.data.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        );
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

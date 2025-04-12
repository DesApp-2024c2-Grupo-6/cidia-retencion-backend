import { getAlumnos } from '../services/alumnosService';

/**
 * Entrada: Id de carrera
 * Salida: Array con los Ids de alumnos de la carrera o array vacio si Id es invalido
 */
export async function obtenerAlumnos(req, res) {
  try {
    const alumnos = await getAlumnos(req.params.id);
    if (alumnos) {
      res.status(200).json(alumnos.data);
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

import { getPeriodos } from '../services/periodosLectivosService';

export async function obtenerPeriodosLectivos(_req, res) {
  try {
    const periodos = await getPeriodos();
    if (periodos) {
      res
        .status(200)
        .json(
          periodos.data.sort(
            (a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio)
          )
        );
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

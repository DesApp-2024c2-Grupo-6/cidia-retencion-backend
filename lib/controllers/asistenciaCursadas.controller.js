import { getCursos } from '../services/materiasService';
import {
  getDatosDeCurso,
  getAsistenciaPorClase,
} from '../services/cursosService';

export async function obtenerAsistenciaCursada(req, res) {
  const idPeriodo = Number(req.params.idPeriodo);
  const idMateria = Number(req.params.idMateria);

  console.log(idMateria);
  console.log(idPeriodo);

  const cursos = (await getCursos(idMateria, idPeriodo)).data;

  console.log(cursos);

  //Si no se encontraron cursos, se retorna un objeto vacio
  if (cursos == []) res.status(204).json({ msg: 'No se encontraron cursos' });

  //Lista de Cursos junt con asistencia
  const asistenciaCursos = await Promise.all(
    cursos.map(async (curso) => {
      //Obtener datos del curso y asistencia del curso de guarani
      const cursoData = (await getDatosDeCurso(curso.curso_id)).data;
      const asistencia = (await getAsistenciaPorClase(curso.curso_id)).data;

      //Ordenar de menor a mayor las clases segun la fecha
      const asistenciaOrdenada = asistencia.sort((a, b) => {
        return new Date(a.fecha) - new Date(b.fecha);
      });

      //Calcular los datos de asistencia
      const asistenciaCursada = asistenciaOrdenada.map(
        (asistenciaData, index) => ({
          name: `Semana ${index + 1}`,
          porcentajeAlumnos: asistenciaData.hay_datos_asistencia
            ? Math.round(
                (asistenciaData.cant_presentes * 100) /
                  cursoData.cantidad_inscriptos
              )
            : 0,
          cantidadAlumnos: asistenciaData.hay_datos_asistencia
            ? asistenciaData.cant_presentes
            : 0,
        })
      );

      //Datos del curso junto con todos los datos de asistencia del mismo
      const cursoConAsistencia = {
        nombre_materia: cursoData.nombre,
        nombre_curso: cursoData.nombre_curso,
        cantidad_inscriptos: cursoData.cantidad_inscriptos,
        inscriptos_semanales: asistenciaCursada,
      };
      return cursoConAsistencia;
    })
  );

  const response = {
    msg: `${asistenciaCursos.length} cursos encontrados`,
    nombre_materia: cursos[0].nombre,
    cursos: asistenciaCursos,
  };
  res.status(200).json(response);
}

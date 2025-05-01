import {
  getAsistenciaPorClase,
  getDatosDeCurso,
} from '../services/cursosService';
import { getCursos } from '../services/materiasService';

/**
 * @param {*} req Id de curso
 * @param {*} res Informacion de curso u objeto vacio de no ser Id valido
 */
export async function obtenerCurso(req, res) {
  try {
    const curso = await getDatosDeCurso(req.params.id);
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
 * @param {*} req Id de materia, id de periodo
 * @param {*} res Array con informacion de asistencias o mensaje de "No se encontraron cursos"
 */
export async function obtenerAsistenciaDeTodosLosCursos(req, res) {
  try {
    const idPeriodo = Number(req.params.idPeriodo);
    const idMateria = Number(req.params.idMateria);

    const cursos = (await getCursos(idMateria, idPeriodo)).data;

    //Si no se encontraron cursos, se retorna un objeto vacio
    if (cursos.length == 0) {
      res.status(404).json({ msg: 'No se encontraron cursos' });
    } else {
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
          const asistenciaCursada = [];
          const clasesSemanales = cursoData.horarios.length;
          for (let i = 0; i < asistenciaOrdenada.length; i += clasesSemanales) {
            const nombreSemana =
              clasesSemanales == 1
                ? `Semana ${i + 1}`
                : `Semana ${Math.floor(i / 2) + 1}`;

            const asistenciaSemanal = {
              name: nombreSemana,
              cantidadAlumnos: '',
              porcentajeAlumnos: '',
            };

            let asistenciaTotal = 0;

            if (clasesSemanales == 2) {
              const asistenciaPrimerClase = asistenciaOrdenada[i]
                .hay_datos_asistencia
                ? asistenciaOrdenada[i].cant_presentes
                : 0;
              const asistenciaSegundaClase = asistenciaOrdenada[i + 1]
                .hay_datos_asistencia
                ? asistenciaOrdenada[i + 1].cant_presentes
                : 0;
              asistenciaTotal = Math.round(
                (asistenciaPrimerClase + asistenciaSegundaClase) / 2
              );
            } else {
              asistenciaTotal = asistenciaOrdenada[i].hay_datos_asistencia
                ? asistenciaOrdenada[i].cant_presentes
                : 0;
            }

            asistenciaSemanal.cantidadAlumnos = asistenciaTotal;
            asistenciaSemanal.porcentajeAlumnos = Math.round(
              (asistenciaTotal * 100) / cursoData.cantidad_inscriptos
            );

            asistenciaCursada.push(asistenciaSemanal);
          }

          //Datos del curso junto con todos los datos de asistencia del mismo
          const cursoConAsistencia = {
            id_curso: cursoData.curso_id,
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
  } catch (error) {
    res.status(500).json({ msg: 'Error inesperado', error });
  }
}

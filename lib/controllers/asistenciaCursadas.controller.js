import { getCursos } from '../services/materiasService';
import {
  getDatosDeCurso,
  getAsistenciaPorClase,
} from '../services/cursosService';

export async function obtenerCursosDeMateria(req, res) {
  try {
    const idPeriodo = Number(req.params.idPeriodo);
    const idMateria = Number(req.params.idMateria);

    const cursos = (await getCursos(idMateria, idPeriodo)).data;

    if (cursos.length == 0)
      res.status(204).json({ msg: 'No se encontraron cursos' });

    const response = {
      msg: `${cursos.length} cursos encontrados`,
      nombre_materia: cursos[0].nombre,
      cursos: cursos,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error });
  }
}

export async function obtenerAsistenciaFormateadaDeCurso(req, res) {
  try {
    const idCurso = Number(req.params.id);
    const cursoData = (await getDatosDeCurso(idCurso)).data;
    const asistenciaData = (await getAsistenciaPorClase(idCurso)).data;
    const asistenciaOrdenada = asistenciaData.sort((a, b) => {
      return new Date(a.fecha) - new Date(b.fecha);
    });

    //Calcular los datos de asistencia
    console.log(cursoData);
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
        const asistenciaPrimerClase = asistenciaOrdenada[i].hay_datos_asistencia
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

    const cursoConAsistencia = {
      id_curso: cursoData.curso_id,
      nombre_materia: cursoData.nombre,
      nombre_curso: cursoData.nombre_curso,
      cantidad_inscriptos: cursoData.cantidad_inscriptos,
      inscriptos_semanales: asistenciaCursada,
    };

    const response = {
      msg: 'Asistencia encontrada',
      curso: cursoConAsistencia,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error });
  }
}

export async function obtenerAsistenciaDeTodosLosCursos(req, res) {
  const idPeriodo = Number(req.params.idPeriodo);
  const idMateria = Number(req.params.idMateria);

  const cursos = (await getCursos(idMateria, idPeriodo)).data;

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

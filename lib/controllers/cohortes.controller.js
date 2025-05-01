import { getAlumnos, postAlumnosData } from '../services/alumnosService';
import { getMateria, getSubj } from '../services/materiasService';
import { subjectStatusSchema } from '../models/alumnos.schema';
import mongoose from 'mongoose';
import { getPeriodo, getPeriodos } from '../services/periodosLectivosService';
import { getCarrera } from '../services/carrerasService';
import { forEach } from 'lodash';


async function obtenerDatosDeAlumnoEnPeriodo(Schema, alumno, idPeriodo, ultimosCuatrimestres) {

  //Encontrar un registro donde alumno_id = alumno.id y cuatrimestre_id = idPeriodo
  //Materias inscriptas: Contar las materias donde periodoUltimaCursada = idPeriodo
  //Materias regularizadas: Contar las materias donde periodoReg = idPeriodo
  //Sigue: Si hay almenos una materia que este dentro de ultimosCuatrimestres
  //Abandono: No sigue y no se egreso
  //Termino: Se egreso y no sigue


  const query = await Schema.aggregate([
    {
      $match: {
        alumno_id: alumno.id,
        cuatrimestre_id: idPeriodo
      }
    },
    {
      $project: {
        cantidadUltimaCursada: {
          $size: {
            $filter: {
              input: "$status_materias",
              as: "materia",
              cond: { $eq: ["$$materia.periodoUltimaCursada", idPeriodo] }
            }
          }
        },
        cantidadReg: {
          $size: {
            $filter: {
              input: "$status_materias",
              as: "materia",
              cond: { $eq: ["$$materia.periodoReg", idPeriodo] }
            }
          }
        },
        sigue: {
          $gt: [
            {
              $size: {
                $filter: {
                  input: "$status_materias",
                  as: "materia",
                  cond: { $in: ["$$materia.periodoUltimaCursada", ultimosCuatrimestres] }
                }
              }
            },
            0
          ]
        }
      }
    },
    {
      $addFields: {
        abandono: {
          $and: [
            { $eq: ["$sigue", false] },
            { $eq: [alumno.egresado, false] }
          ]
        },
        termino: {
          $and: [
            { $eq: ["$sigue", false] },
            { $eq: [alumno.egresado, true] }
          ]
        }
      }
    }
  ]);

  const resultado = query[0] || null;


  const alumnoData = {
    inscripto: {
      exactamenteUna: (resultado?.cantidadUltimaCursada == 1) || 0,
      exactamenteDos: resultado?.cantidadUltimaCursada == 2,
      exactamenteTres: resultado?.cantidadUltimaCursada == 3,
      cuatroOMas: resultado?.cantidadUltimaCursada >= 4,
      unaMateria: resultado?.cantidadUltimaCursada >= 1,
      dosMaterias: resultado?.cantidadUltimaCursada >= 2,
      tresMaterias: resultado?.cantidadUltimaCursada >= 3,
    },
    regularizo: {
      exactamenteUna: resultado?.cantidadReg == 1,
      exactamenteDos: resultado?.cantidadReg == 2,
      exactamenteTres: resultado?.cantidadReg == 3,
      unaMateria: resultado?.cantidadReg >= 1,
      dosMaterias: resultado?.cantidadReg >= 2,
      tresMaterias: resultado?.cantidadReg >= 3,
      cuatroOMas: resultado?.cantidadReg >= 4,
    },
    sigue: resultado?.sigue,
    abandono: resultado?.abandono,
    termino: resultado?.termino,
  }

  return alumnoData;
};

function agregarDatosDeAlumnoACohorte(cohorteData, alumnoData) {

  //Inscripciones
  cohorteData.inscriptos.total += alumnoData.inscripto.unaMateria ? 1 : 0
  cohorteData.inscriptos.exactamenteUna += alumnoData.inscripto.exactamenteUna ? 1 : 0
  cohorteData.inscriptos.exactamenteDos += alumnoData.inscripto.exactamenteDos ? 1 : 0
  cohorteData.inscriptos.exactamenteTres += alumnoData.inscripto.exactamenteTres ? 1 : 0
  cohorteData.inscriptos.unaMateria += alumnoData.inscripto.unaMateria ? 1 : 0
  cohorteData.inscriptos.dosMaterias += alumnoData.inscripto.dosMaterias ? 1 : 0
  cohorteData.inscriptos.tresMaterias += alumnoData.inscripto.tresMaterias ? 1 : 0
  cohorteData.inscriptos.cuatroOMas += alumnoData.inscripto.cuatroOMas ? 1 : 0

  //Regularizadas:
  cohorteData.regularizaron.total += alumnoData.regularizo.unaMateria ? 1 : 0
  cohorteData.regularizaron.exactamenteUna += alumnoData.regularizo.exactamenteUna ? 1 : 0
  cohorteData.regularizaron.exactamenteDos += alumnoData.regularizo.exactamenteDos ? 1 : 0
  cohorteData.regularizaron.exactamenteTres += alumnoData.regularizo.exactamenteTres ? 1 : 0
  cohorteData.regularizaron.unaMateria += alumnoData.regularizo.unaMateria ? 1 : 0
  cohorteData.regularizaron.dosMaterias += alumnoData.regularizo.dosMaterias ? 1 : 0
  cohorteData.regularizaron.tresMaterias += alumnoData.regularizo.tresMaterias ? 1 : 0
  cohorteData.regularizaron.cuatroOMas += alumnoData.regularizo.cuatroOMas ? 1 : 0

  //Otros
  cohorteData.siguen += alumnoData.sigue ? 1 : 0
  cohorteData.abandonaron += alumnoData.abandono ? 1 : 0
  cohorteData.terminaron += alumnoData.termino ? 1 : 0
}

async function cantidadRegularizadosEnMateria(Schema, idsAlumnos, idPeriodo, idMateria) {

  const resultado = await Schema.aggregate([
    {
      $match: {
        alumno_id: { $in: idsAlumnos },
        cuatrimestre_id: idPeriodo
      }
    },
    {
      $project: {
        materiasFiltradas: {
          $filter: {
            input: "$status_materias",
            as: "materia",
            cond: {
              $and: [
                { $eq: ["$$materia.materia_id", idMateria] },
                { $eq: ["$$materia.periodoReg", idPeriodo] }
              ]
            }
          }
        }
      }
    },
    {
      $match: {
        "materiasFiltradas.0": { $exists: true }
      }
    },
    {
      $count: "cantidad"
    }
  ]);

  return resultado[0]?.cantidad || 0;
}

async function cohorteDePeriodo(alumnosGuaraniData, idPeriodo, materiasDeCarrera) {

  const periodo = await getPeriodo(idPeriodo);

  const ultimosCuatrimestres = await ultimosPeriodosHastaAbandono(idPeriodo)

  console.log(periodo.data.nombre)

  //Cohorte vacia
  const cohorte = {
    idPeriodo,
    nombrePeriodo: periodo.data.nombre,
    inscriptos: {
      total: 0,
      exactamenteUna: 0,
      exactamenteDos: 0,
      exactamenteTres: 0,
      unaMateria: 0,
      dosMaterias: 0,
      tresMaterias: 0,
      cuatroOMas: 0,
    },
    regularizaron: {
      total: 0,
      exactamenteUna: 0,
      exactamenteDos: 0,
      exactamenteTres: 0,
      unaMateria: 0,
      dosMaterias: 0,
      tresMaterias: 0,
      cuatroOMas: 0,
    },
    siguen: 0,
    abandonaron: 0,
    terminaron: 0,
    materias: [],
  };

  const SubjectStatus = mongoose.model('SubjectStatus', subjectStatusSchema);

  //Datos de los alumnos
  await Promise.all(
    alumnosGuaraniData.map(async (alumno) => {
      const alumnoData = await obtenerDatosDeAlumnoEnPeriodo(SubjectStatus, alumno, idPeriodo, ultimosCuatrimestres)
      agregarDatosDeAlumnoACohorte(cohorte, alumnoData)
    })
  )

  // Materias: en paralelo

  const idsAlumnosGuarani = alumnosGuaraniData.map(alumno => alumno.id)

  cohorte.materias = await Promise.all(
    materiasDeCarrera.map(async (materia) => ({
      idMateria: materia.id,
      nombre: materia.nombre,
      regularizaron: await cantidadRegularizadosEnMateria(SubjectStatus, idsAlumnosGuarani, idPeriodo, materia.id),
    }))
  );


  return cohorte;
}


async function cuatrimestresSiguientes(idPeriodo) {
  const periodos = (await getPeriodos()).data;
  const cuatrimestres = periodos.filter((periodo) => periodo.esCuatrimestre);
  const idCuatrimestres = cuatrimestres.map((cuatri) => cuatri.periodoId);
  const idCuatrimestresOrdenados = idCuatrimestres.sort((a, b) => a - b);
  const indice = idCuatrimestresOrdenados.indexOf(idPeriodo);
  //const siguientes = idCuatrimestresOrdenados.slice(indice, indice + 3);
  const siguientes = idCuatrimestresOrdenados.slice(indice, idCuatrimestresOrdenados.length - 1);
  return siguientes;
}

const ultimosPeriodosHastaAbandono = async (idPeriodo) => {
  const periodos = (await getPeriodos()).data;
  const cuatrimestres = periodos.filter((periodo) => periodo.esCuatrimestre);
  const idCuatrimestres = cuatrimestres.map((cuatri) => cuatri.periodoId);
  const idCuatrimestresOrdenados = idCuatrimestres.sort((a, b) => a - b);
  const indice = idCuatrimestresOrdenados.indexOf(idPeriodo);
  const siguientes = idCuatrimestresOrdenados.slice(indice, indice + 3);
  return siguientes;
};

const alumnosDeCohorte = async (idCarrera, idPeriodo) => {

  const idsAlumnos = (await getAlumnos(idCarrera)).data;

  const alumnosGuarani = (await postAlumnosData(idsAlumnos)).data;

  const alumnosDePeriodo = alumnosGuarani.filter(alumno => alumno.primerPeriodo?.periodoId == idPeriodo)

  return alumnosDePeriodo;
}

export async function obtenerCohorteCarrera(req, res) {
  const idCarrera = await req.params.idCarrera;
  const idPeriodo = await req.params.idPeriodo;
  //const idCarrera = 38 //Informatica
  //const idPeriodo = 13; //1C2018

  const idPeriodos = await cuatrimestresSiguientes(Number(idPeriodo));

  const materiasSinOrdenar = (await getSubj(idCarrera)).data.filter((materia) => !materia.esUnahur);

  const materiasDeCarrera = materiasSinOrdenar.sort((a, b) => a.nombre.localeCompare(b.nombre));

  const carrera = await getCarrera(idCarrera);

  const alumnosGuaraniData = (await alumnosDeCohorte(idCarrera, idPeriodo)).map(alumno => ({ id: alumno.alumno, egresado: alumno.egresado }))

  const response = {
    totalAlumnos: alumnosGuaraniData.length,
    idCarrera: idCarrera,
    idPeriodo: idPeriodo,
    nombreCarrera: carrera.data.nombre,
    nombrePeriodo: '',
    cohortes: [],
    msg: 'Cohortes generadas correctamente',
  };

  //Para todos los periodos
  const cohortesData = await Promise.all(
    idPeriodos.map(async (idPeriodo) => {
      const cohorte = await cohorteDePeriodo(
        alumnosGuaraniData,
        idPeriodo,
        materiasDeCarrera,
      );
      return cohorte;
    })
  );
  response.cohortes = cohortesData;
  response.nombrePeriodo = cohortesData[0].nombrePeriodo;

  res.status(200).json(response);
}

//COHORTES MATERIAS

async function alumnosRegularizadosAcumuladosDeMateria(
  Schema,
  idMateria,
  idPeriodo,
  idCarrera
) {
  const resultado = await Schema.aggregate([
    {
      $match: {
        carrera_id: idCarrera,
      },
    },
    {
      $unwind: '$status_materias',
    },
    {
      $match: {
        'status_materias.periodoReg': { $lte: idPeriodo },
        'status_materias.materia_id': idMateria,
      },
    },
    {
      $count: 'total',
    },
  ]);
  return resultado[0]?.total || 0;
}

async function alumnosInscriptosAcumuladosDeMateria(
  Schema,
  idMateria,
  idPeriodo,
  idCarrera,
  cantidadDeCursadas
) {
  const cantidadCursadasCondition =
    cantidadDeCursadas < 4 ? { $eq: cantidadDeCursadas } : { $gte: 4 };

  const resultado = await Schema.aggregate([
    {
      $match: {
        carrera_id: idCarrera,
      },
    },
    {
      $unwind: '$status_materias',
    },
    {
      $match: {
        'status_materias.materia_id': idMateria,
        'status_materias.periodoUltimaCursada': { $lte: idPeriodo },
        'status_materias.cantidadCursadas': cantidadCursadasCondition,
      },
    },
    {
      $count: 'total',
    },
  ]);
  return resultado[0]?.total || 0;
}

async function alumnosRegularizadosEnCuatrimestreDeMateria(
  Schema,
  idMateria,
  idPeriodo,
  idCarrera
) {
  const resultado = await Schema.aggregate([
    {
      $match: {
        carrera_id: idCarrera,
      },
    },
    {
      $unwind: '$status_materias',
    },
    {
      $match: {
        'status_materias.periodoReg': idPeriodo,
        'status_materias.materia_id': idMateria,
      },
    },
    {
      $count: 'total',
    },
  ]);
  return resultado[0]?.total || 0;
}

async function alumnosRegularizadosEnCuatrimestreDeMateriaSegunCantidad(
  Schema,
  idMateria,
  idPeriodo,
  idCarrera,
  cantidadCursadas
) {
  const cantidadCursadasCond =
    cantidadCursadas < 4 ? { $eq: cantidadCursadas } : { $gte: 4 };

  const resultado = await Schema.aggregate([
    {
      $match: {
        carrera_id: idCarrera,
      },
    },
    {
      $unwind: '$status_materias',
    },
    {
      $match: {
        'status_materias.periodoReg': idPeriodo,
        'status_materias.materia_id': idMateria,
        'status_materias.cantidadCursadas': cantidadCursadasCond,
      },
    },
    {
      $count: 'total',
    },
  ]);
  return resultado[0]?.total || 0;
}

async function alumnosInscriptosEnCuatrimestreDeMateria(
  Schema,
  idMateria,
  idPeriodo,
  idCarrera
) {
  const resultado = await Schema.aggregate([
    {
      $match: {
        carrera_id: idCarrera,
      },
    },
    {
      $unwind: '$status_materias',
    },
    {
      $match: {
        'status_materias.periodoUltimaCursada': idPeriodo,
        'status_materias.materia_id': idMateria,
      },
    },
    {
      $count: 'total',
    },
  ]);

  return resultado[0]?.total || 0;
}

async function alumnosInscriptosEnCuatrimestreDeMateriaSegunCantidad(
  Schema,
  idMateria,
  idPeriodo,
  idCarrera,
  cantidadCursadas
) {
  const cantidadCursadasCond =
    cantidadCursadas < 4 ? { $eq: cantidadCursadas } : { $gte: 4 };

  const resultado = await Schema.aggregate([
    {
      $match: {
        carrera_id: idCarrera,
      },
    },
    {
      $unwind: '$status_materias',
    },
    {
      $match: {
        'status_materias.periodoUltimaCursada': idPeriodo,
        'status_materias.materia_id': idMateria,
        'status_materias.cantidadCursadas': cantidadCursadasCond,
      },
    },
    {
      $count: 'total',
    },
  ]);
  return resultado[0]?.total || 0;
}

async function cohorteMateriaDePeriodo(
  Schema,
  idMateria,
  idPeriodo,
  idCarrera
) {
  const [
    periodo,
    regularizaron,
    inscriptos_1,
    inscriptos_2,
    inscriptos_3,
    inscriptos_4,
    regularizaron_total,
    regularizaron_1,
    regularizaron_2,
    regularizaron_3,
    regularizaron_4,
    inscriptos_total,
    inscriptos_1_cuatrimestre,
    inscriptos_2_cuatrimestre,
    inscriptos_3_cuatrimestre,
    inscriptos_4_cuatrimestre,
  ] = await Promise.all([
    getPeriodo(idPeriodo),
    alumnosRegularizadosAcumuladosDeMateria(
      Schema,
      idMateria,
      idPeriodo,
      idCarrera
    ),
    alumnosInscriptosAcumuladosDeMateria(
      Schema,
      idMateria,
      idPeriodo,
      idCarrera,
      1
    ),
    alumnosInscriptosAcumuladosDeMateria(
      Schema,
      idMateria,
      idPeriodo,
      idCarrera,
      2
    ),
    alumnosInscriptosAcumuladosDeMateria(
      Schema,
      idMateria,
      idPeriodo,
      idCarrera,
      3
    ),
    alumnosInscriptosAcumuladosDeMateria(
      Schema,
      idMateria,
      idPeriodo,
      idCarrera,
      4
    ),
    alumnosRegularizadosEnCuatrimestreDeMateria(
      Schema,
      idMateria,
      idPeriodo,
      idCarrera
    ),
    alumnosRegularizadosEnCuatrimestreDeMateriaSegunCantidad(
      Schema,
      idMateria,
      idPeriodo,
      idCarrera,
      1
    ),
    alumnosRegularizadosEnCuatrimestreDeMateriaSegunCantidad(
      Schema,
      idMateria,
      idPeriodo,
      idCarrera,
      2
    ),
    alumnosRegularizadosEnCuatrimestreDeMateriaSegunCantidad(
      Schema,
      idMateria,
      idPeriodo,
      idCarrera,
      3
    ),
    alumnosRegularizadosEnCuatrimestreDeMateriaSegunCantidad(
      Schema,
      idMateria,
      idPeriodo,
      idCarrera,
      4
    ),
    alumnosInscriptosEnCuatrimestreDeMateria(
      Schema,
      idMateria,
      idPeriodo,
      idCarrera
    ),
    alumnosInscriptosEnCuatrimestreDeMateriaSegunCantidad(
      Schema,
      idMateria,
      idPeriodo,
      idCarrera,
      1
    ),
    alumnosInscriptosEnCuatrimestreDeMateriaSegunCantidad(
      Schema,
      idMateria,
      idPeriodo,
      idCarrera,
      2
    ),
    alumnosInscriptosEnCuatrimestreDeMateriaSegunCantidad(
      Schema,
      idMateria,
      idPeriodo,
      idCarrera,
      3
    ),
    alumnosInscriptosEnCuatrimestreDeMateriaSegunCantidad(
      Schema,
      idMateria,
      idPeriodo,
      idCarrera,
      4
    ),
  ]);

  const salida = {
    acumulado: {
      idPeriodo,
      nombrePeriodo: periodo.data.nombre,
      regularizaron,
      inscriptos_1,
      inscriptos_2,
      inscriptos_3,
      inscriptos_4,
    },
    cuatrimestre: {
      idPeriodo,
      nombrePeriodo: periodo.data.nombre,
      regularizaron_total,
      regularizaron_1,
      regularizaron_2,
      regularizaron_3,
      regularizaron_4,
      inscriptos_total,
      inscriptos_1: inscriptos_1_cuatrimestre,
      inscriptos_2: inscriptos_2_cuatrimestre,
      inscriptos_3: inscriptos_3_cuatrimestre,
      inscriptos_4: inscriptos_4_cuatrimestre,
    },
  };

  return salida;
}

export async function obtenerCohorteMateria(req, res) {
  try {
    let idMateria = Number(req.params.idMateria);
    let idPeriodo = Number(req.params.idPeriodo);
    let idCarrera = Number(req.params.idCarrera);

    //Para probar
    //idCarrera = 38 //Lic en informatica
    //idPeriodo = 13 //1C2018
    //idMateria = 580 //Intro a la logica

    const idPeriodos = await cuatrimestresSiguientes(Number(idPeriodo));
    const carrera = await getCarrera(idCarrera);
    const materia = await getMateria(idCarrera, idMateria);
    const periodo = await getPeriodo(idPeriodo);

    const response = {
      idMateria: idMateria,
      nombreMateria: materia.data.nombre,
      idPeriodo: idPeriodo,
      nombrePeriodo: periodo.data.nombre,
      idCarrera: idCarrera,
      nombreCarrera: carrera.data.nombre,
      acumulado: [],
      cuatrimestre: [],
      msg: 'Cohorte de materia generada',
    };

    const SubjectStatus = mongoose.model('SubjectStatus', subjectStatusSchema);

    const cuatrimestreData = await Promise.all(
      idPeriodos.map(async (idPeriodo) => {
        const materiaData = await cohorteMateriaDePeriodo(
          SubjectStatus,
          idMateria,
          idPeriodo,
          idCarrera
        );
        return materiaData;
      })
    ); // => [{acumulado:{...}, cuatrimestre:{...}]

    response.acumulado = cuatrimestreData.map(
      (cuatrimestre) => cuatrimestre.acumulado
    );
    response.cuatrimestre = cuatrimestreData.map(
      (cuatrimestre) => cuatrimestre.cuatrimestre
    );

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: 'Error inesperado', error });
  }
}

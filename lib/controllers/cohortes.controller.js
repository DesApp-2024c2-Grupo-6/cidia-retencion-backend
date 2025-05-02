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
  try {
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
  catch (error) {
    res.status(500).json({ msg: 'Error inesperado', error });
  }
}

//COHORTES MATERIAS


async function cohorteMateriaDePeriodo(Schema, idsAlumnos, idCarrera, idPeriodo, idMateria) {

  const periodo = await getPeriodo(idPeriodo);

  const pipeline = [
    {
      $match: {
        alumno_id: { $in: idsAlumnos },
        cuatrimestre_id: idPeriodo,
        carrera_id: idCarrera
      }
    },
    { $unwind: "$status_materias" },
    {
      $match: {
        "status_materias.materia_id": idMateria
      }
    },
    {
      $facet: {
        acumulado: [
          {
            $match: {
              "status_materias.periodoReg": { $lte: idPeriodo }
            }
          },
          {
            $group: {
              _id: null,
              regularizados: { $sum: 1 },
              inscriptos_1: {
                $sum: {
                  $cond: [{ $eq: ["$status_materias.cantidadCursadas", 1] }, 1, 0]
                }
              },
              inscriptos_2: {
                $sum: {
                  $cond: [{ $eq: ["$status_materias.cantidadCursadas", 2] }, 1, 0]
                }
              },
              inscriptos_3: {
                $sum: {
                  $cond: [{ $eq: ["$status_materias.cantidadCursadas", 3] }, 1, 0]
                }
              },
              inscriptos_4: {
                $sum: {
                  $cond: [{ $eq: ["$status_materias.cantidadCursadas", 4] }, 1, 0]
                }
              }
            }
          }
        ],
        cuatrimestre: [
          {
            $group: {
              _id: null,
              regularizados_1: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$status_materias.periodoReg", idPeriodo] },
                        { $eq: ["$status_materias.cantidadCursadas", 1] }
                      ]
                    },
                    1, 0
                  ]
                }
              },
              regularizados_2: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$status_materias.periodoReg", idPeriodo] },
                        { $eq: ["$status_materias.cantidadCursadas", 2] }
                      ]
                    },
                    1, 0
                  ]
                }
              },
              regularizados_3: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$status_materias.periodoReg", idPeriodo] },
                        { $eq: ["$status_materias.cantidadCursadas", 3] }
                      ]
                    },
                    1, 0
                  ]
                }
              },
              regularizados_4: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$status_materias.periodoReg", idPeriodo] },
                        { $gte: ["$status_materias.cantidadCursadas", 4] }
                      ]
                    },
                    1, 0
                  ]
                }
              },
              inscriptos_1: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$status_materias.periodoUltimaCursada", idPeriodo] },
                        { $eq: ["$status_materias.cantidadCursadas", 1] }
                      ]
                    },
                    1, 0
                  ]
                }
              },
              inscriptos_2: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$status_materias.periodoUltimaCursada", idPeriodo] },
                        { $eq: ["$status_materias.cantidadCursadas", 2] }
                      ]
                    },
                    1, 0
                  ]
                }
              },
              inscriptos_3: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$status_materias.periodoUltimaCursada", idPeriodo] },
                        { $eq: ["$status_materias.cantidadCursadas", 3] }
                      ]
                    },
                    1, 0
                  ]
                }
              },
              inscriptos_4: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$status_materias.periodoUltimaCursada", idPeriodo] },
                        { $gte: ["$status_materias.cantidadCursadas", 4] }
                      ]
                    },
                    1, 0
                  ]
                }
              }
            }
          },
          {
            $addFields: {
              regularizados_total: {
                $add: [
                  "$regularizados_1",
                  "$regularizados_2",
                  "$regularizados_3",
                  "$regularizados_4"
                ]
              },
              inscriptos_total: {
                $add: [
                  "$inscriptos_1",
                  "$inscriptos_2",
                  "$inscriptos_3",
                  "$inscriptos_4"
                ]
              }
            }
          }
        ]
      }
    }
  ];

  const result = await Schema.aggregate(pipeline);

  const acumulado = result[0].acumulado[0] || {
    regularizados: 0,
    inscriptos_1: 0,
    inscriptos_2: 0,
    inscriptos_3: 0,
    inscriptos_4: 0
  };

  const cuatrimestre = result[0].cuatrimestre[0] || {
    regularizados_1: 0,
    regularizados_2: 0,
    regularizados_3: 0,
    regularizados_4: 0,
    inscriptos_1: 0,
    inscriptos_2: 0,
    inscriptos_3: 0,
    inscriptos_4: 0,
    regularizados_total: 0,
    inscriptos_total: 0
  };

  return { idPeriodo, nombrePeriodo: periodo.data.nombre, acumulado, cuatrimestre };
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
    const idsAlumnosGuarani = (await alumnosDeCohorte(idCarrera, idPeriodo)).map(alumno => alumno.alumno)

    const response = {
      idMateria: idMateria,
      nombreMateria: materia.data.nombre,
      idPeriodo: idPeriodo,
      nombrePeriodo: periodo.data.nombre,
      idCarrera: idCarrera,
      nombreCarrera: carrera.data.nombre,
      cohorte: [],
      msg: 'Cohorte de materia generada',
    };

    const SubjectStatus = mongoose.model('SubjectStatus', subjectStatusSchema);

    const cuatrimestreData = await Promise.all(
      idPeriodos.map(async (idPeriodo) => {
        const materiaData = await cohorteMateriaDePeriodo(SubjectStatus, idsAlumnosGuarani, idCarrera, idPeriodo, idMateria);
        return materiaData;
      })
    ); // => [{acumulado:{...}, cuatrimestre:{...}]

    response.cohorte = cuatrimestreData

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: 'Error inesperado', error });
  }
}

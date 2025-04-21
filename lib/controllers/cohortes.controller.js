import { getAlumnos, postAlumnosData } from "../services/alumnosService";
import { getSubj } from "../services/materiasService";
import { subjectStatusSchema } from "../models/alumnos.schema";
import mongoose from "mongoose";

async function alumnosAnotadosAExactamenteMaterias(idPeriodo, cantidadDeseada) {
    const SubjectStatus = mongoose.model('SubjectStatus', subjectStatusSchema);
    const matchCondicion = cantidadDeseada < 4
        ? { totalCoincidencias: cantidadDeseada }
        : { totalCoincidencias: { $gte: cantidadDeseada } };

    const resultado = await SubjectStatus.aggregate([
        {
            $addFields: {
                coincidencias: {
                    $filter: {
                        input: "$status_materias",
                        as: "materia",
                        cond: { $eq: ["$$materia.periodoUltimaCursada", idPeriodo] }
                    }
                }
            }
        },
        {
            $addFields: {
                totalCoincidencias: { $size: "$coincidencias" }
            }
        },
        {
            $match: matchCondicion
        },
        {
            $count: "total"
        }
    ]);

    return resultado[0]?.total || 0;
}

async function alumnosRegulzarizadosExactamenteEnMaterias(idPeriodo, cantidadDeseada) {
    const SubjectStatus = mongoose.model('SubjectStatus', subjectStatusSchema);

    const matchCondicion = cantidadDeseada < 4
        ? { totalCoincidencias: cantidadDeseada }
        : { totalCoincidencias: { $gte: cantidadDeseada } };

    const resultado = await SubjectStatus.aggregate([
        {
            $addFields: {
                coincidencias: {
                    $filter: {
                        input: "$status_materias",
                        as: "materia",
                        cond: { $eq: ["$$materia.periodoReg", idPeriodo] }
                    }
                }
            }
        },
        {
            $addFields: {
                totalCoincidencias: { $size: "$coincidencias" }
            }
        },
        {
            $match: matchCondicion
        },
        {
            $count: "total"
        }
    ]);

    return resultado[0]?.total || 0;
}

async function alumnosQueAbandonaron(idPeriodo, ultimosPeriodos) {
    const SubjectStatus = mongoose.model('SubjectStatus', subjectStatusSchema);

    const resultado = await SubjectStatus.aggregate([
        {
            $match: {
                cuatrimestre_id: idPeriodo
            }
        },
        {
            $addFields: {
                coincidencias: {
                    $filter: {
                        input: "$status_materias",
                        as: "materia",
                        cond: {
                            $in: ["$$materia.periodoUltimaCursada", ultimosPeriodos]
                        }
                    }
                }
            }
        },
        {
            $match: {
                coincidencias: { $size: 0 }
            }
        },
        {
            $count: "total"
        }
    ]);

    return resultado[0]?.total || 0;
}

async function cohorteDePeriodo(totalAlumnos, idPeriodo, alumnosGuarani, materiasDeCarrera, ultimosPeriodos) {
    const cohorteData = {
        idPeriodo: idPeriodo,
        nombrePeriodo: "NOMBRE DEL PERIODO",
        inscriptos: {
            exactamenteUna: 0,
            exactamenteDos: 0,
            exactamenteTres: 0,
            unaMateria: 0,
            dosMaterias: 0,
            tresMaterias: 0,
            cuatroMateriasOMas: 0,
        },
        regularizaron: {
            exactamenteUna: 0,
            exactamenteDos: 0,
            exactamenteTres: 0,
            cuatroMateriasOMas: 0,
            unaMateria: 0,
            dosMaterias: 0,
            tresMaterias: 0,
        },
        siguen: 0,
        abandonaron: 0,
        terminaron: 0,
        materiasData: []
    }
    const alumnosGuaraniPeriodoActual = alumnosGuarani.filter(alumno => (alumno?.primerPeriodo?.periodoId != undefined) && alumno.primerPeriodo.periodoId == idPeriodo)
    cohorteData.terminaron = (alumnosGuaraniPeriodoActual.filter(alumno => alumno.egresado == true)).length
    //Inscriptos
    const inscriptos = cohorteData.inscriptos
    inscriptos.exactamenteUna = await alumnosAnotadosAExactamenteMaterias(idPeriodo, 1)
    inscriptos.exactamenteDos = await alumnosAnotadosAExactamenteMaterias(idPeriodo, 2)
    inscriptos.exactamenteTres = await alumnosAnotadosAExactamenteMaterias(idPeriodo, 3)
    inscriptos.cuatroMateriasOMas = await alumnosAnotadosAExactamenteMaterias(idPeriodo, 4)
    inscriptos.unaMateria = inscriptos.exactamenteUna + inscriptos.exactamenteDos + inscriptos.exactamenteTres + inscriptos.cuatroMateriasOMas
    inscriptos.dosMaterias = inscriptos.exactamenteDos + inscriptos.exactamenteTres + inscriptos.cuatroMateriasOMas
    inscriptos.tresMaterias = inscriptos.exactamenteTres + inscriptos.cuatroMateriasOMas
    //Regularizaron
    const regularizaron = cohorteData.regularizaron
    regularizaron.exactamenteUna = await alumnosRegulzarizadosExactamenteEnMaterias(idPeriodo, 1)
    regularizaron.exactamenteDos = await alumnosRegulzarizadosExactamenteEnMaterias(idPeriodo, 2)
    regularizaron.exactamenteTres = await alumnosRegulzarizadosExactamenteEnMaterias(idPeriodo, 3)
    regularizaron.cuatroMateriasOMas = await alumnosRegulzarizadosExactamenteEnMaterias(idPeriodo, 4)
    regularizaron.unaMateria = regularizaron.exactamenteUna + regularizaron.exactamenteDos + regularizaron.exactamenteTres + regularizaron.cuatroMateriasOMas
    regularizaron.dosMaterias = regularizaron.exactamenteDos + regularizaron.exactamenteTres + regularizaron.cuatroMateriasOMas
    regularizaron.tresMaterias = regularizaron.exactamenteTres + regularizaron.cuatroMateriasOMas
    //Otros
    cohorteData.abandonaron = await alumnosQueAbandonaron(idPeriodo, ultimosPeriodos)
    cohorteData.siguen = totalAlumnos - cohorteData.abandonaron - cohorteData.terminaron

    //Materias
    const materiasData = await Promise.all(materiasDeCarrera.map(async (materia) => {
        return (
            {
                idMateria: materia.id,
                nombre: materia.nombre,
                regularizaron: (await alumnosConMateriaRegularizada(idPeriodo, materia.id))
            }
        )
    }
    ))
    cohorteData.materiasData = materiasData
    return cohorteData
}

async function alumnosConMateriaRegularizada(idPeriodo, materiaId) {
    const SubjectStatus = mongoose.model('SubjectStatus', subjectStatusSchema);

    const resultado = await SubjectStatus.find({
        status_materias: {
            $elemMatch: {
                materia_id: materiaId,
                periodoReg: { $lte: idPeriodo }
            }
        }
    });


    return resultado.length || 0;
}

export async function obtenerCohorteCarrera(req, res) {
    let idCarrera = req.params.idCarrera;
    let idPeriodo = req.params.idPeriodo
    idCarrera = 38 //Informatica
    idPeriodo = 13; //1C2018
    const idPeriodos = [13, 14, 18] //1C2018, 2C2018, 1C2019
    const ultimosPeriodos = [65, 76, 82]//2C2023, 1C2024, 2C2024
    const materiasDeCarrera = (await getSubj(idCarrera)).data //Informatica

    const response = {
        totalAlumnos: 100000, //ARREGLAR
        cohortesData: []
    }

    const idsAlumnos = (await getAlumnos(idCarrera)).data
    const alumnosGuarani = (await postAlumnosData(idsAlumnos)).data
    //const SubjectStatus = mongoose.model('SubjectStatus', subjectStatusSchema);
    //Para todos los periodos
    const cohortesData = await Promise.all(idPeriodos.map(async (id) => {
        const cohorte = await cohorteDePeriodo(response.totalAlumnos, id, alumnosGuarani, materiasDeCarrera, ultimosPeriodos)
        return cohorte;
    }))
    response.cohortesData.push(cohortesData)
    res.status(200).json(response)

}

//COHORTES MATERIAS

async function alumnosRegularizadosAcumuladosDeMateria(idMateria, idPeriodo, idCarrera) {

    const SubjectStatus = mongoose.model('SubjectStatus', subjectStatusSchema);

    const resultado = await SubjectStatus.aggregate([
        {
            $match: {
                carrera_id: idCarrera
            }
        },
        {
            $unwind: "$status_materias"
        },
        {
            $match: {
                "status_materias.periodoReg": { $lte: idPeriodo },
                "status_materias.materia_id": idMateria
            }
        },
        {
            $count: "total"
        }
    ]);
    return resultado[0]?.total || 0;
}

async function alumnosInscriptosAcumuladosDeMateria(idMateria, idPeriodo, idCarrera, cantidadDeCursadas) {

    const SubjectStatus = mongoose.model('SubjectStatus', subjectStatusSchema);

    const cantidadCursadasCondition = cantidadDeCursadas < 4
        ? { $eq: cantidadDeCursadas }
        : { $gte: 4 };

    const resultado = await SubjectStatus.aggregate([
        {
            $match: {
                carrera_id: idCarrera
            }
        },
        {
            $unwind: "$status_materias"
        },
        {
            $match: {
                "status_materias.materia_id": idMateria,
                "status_materias.periodoUltimaCursada": { $lte: idPeriodo },
                "status_materias.cantidadCursadas": cantidadCursadasCondition
            }
        },
        {
            $count: "total"
        }
    ]);
    return resultado[0]?.total || 0;

}

async function alumnosRegularizadosEnCuatrimestreDeMateria(idMateria, idPeriodo, idCarrera) {
    const SubjectStatus = mongoose.model('SubjectStatus', subjectStatusSchema);

    const resultado = await SubjectStatus.aggregate([
        {
            $match: {
                carrera_id: idCarrera
            }
        },
        {
            $unwind: "$status_materias"
        },
        {
            $match: {
                "status_materias.periodoReg": idPeriodo,
                "status_materias.materia_id": idMateria
            }
        },
        {
            $count: "total"
        }
    ]);
    return resultado[0]?.total || 0;

}

async function alumnosRegularizadosEnCuatrimestreDeMateriaSegunCantidad(idMateria, idPeriodo, idCarrera, cantidadCursadas) {
    const SubjectStatus = mongoose.model('SubjectStatus', subjectStatusSchema);

    const cantidadCursadasCond =
        cantidadCursadas < 4
            ? { $eq: cantidadCursadas }
            : { $gte: 4 };

    const resultado = await SubjectStatus.aggregate([
        {
            $match: {
                carrera_id: idCarrera
            }
        },
        {
            $unwind: "$status_materias"
        },
        {
            $match: {
                "status_materias.periodoReg": idPeriodo,
                "status_materias.materia_id": idMateria,
                "status_materias.cantidadCursadas": cantidadCursadasCond
            }
        },
        {
            $count: "total"
        }
    ]);
    return resultado[0]?.total || 0;

}

async function alumnosInscriptosEnCuatrimestreDeMateria(idMateria, idPeriodo, idCarrera) {

    const SubjectStatus = mongoose.model('SubjectStatus', subjectStatusSchema);

    const resultado = await SubjectStatus.aggregate([
        {
            $match: {
                carrera_id: idCarrera
            }
        },
        {
            $unwind: "$status_materias"
        },
        {
            $match: {
                "status_materias.periodoUltimaCursada": idPeriodo,
                "status_materias.materia_id": idMateria
            }
        },
        {
            $count: "total"
        }
    ]);

    return resultado[0]?.total || 0;

}

async function alumnosInscriptosEnCuatrimestreDeMateriaSegunCantidad(idMateria, idPeriodo, idCarrera, cantidadCursadas) {

    const SubjectStatus = mongoose.model('SubjectStatus', subjectStatusSchema);

    const cantidadCursadasCond =
        cantidadCursadas < 4
            ? { $eq: cantidadCursadas }
            : { $gte: 4 };

    const resultado = await SubjectStatus.aggregate([
        {
            $match: {
                carrera_id: idCarrera
            }
        },
        {
            $unwind: "$status_materias"
        },
        {
            $match: {
                "status_materias.periodoUltimaCursada": idPeriodo,
                "status_materias.materia_id": idMateria,
                "status_materias.cantidadCursadas": cantidadCursadasCond
            }
        },
        {
            $count: "total"
        }
    ]);
    return resultado[0]?.total || 0;

}

async function cohorteMateriaDePeriodo(idMateria, idPeriodo, idCarrera) {
    const [
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
        inscriptos_4_cuatrimestre
    ] = await Promise.all([
        alumnosRegularizadosAcumuladosDeMateria(idMateria, idPeriodo, idCarrera),
        alumnosInscriptosAcumuladosDeMateria(idMateria, idPeriodo, idCarrera, 1),
        alumnosInscriptosAcumuladosDeMateria(idMateria, idPeriodo, idCarrera, 2),
        alumnosInscriptosAcumuladosDeMateria(idMateria, idPeriodo, idCarrera, 3),
        alumnosInscriptosAcumuladosDeMateria(idMateria, idPeriodo, idCarrera, 4),
        alumnosRegularizadosEnCuatrimestreDeMateria(idMateria, idPeriodo, idCarrera),
        alumnosRegularizadosEnCuatrimestreDeMateriaSegunCantidad(idMateria, idPeriodo, idCarrera, 1),
        alumnosRegularizadosEnCuatrimestreDeMateriaSegunCantidad(idMateria, idPeriodo, idCarrera, 2),
        alumnosRegularizadosEnCuatrimestreDeMateriaSegunCantidad(idMateria, idPeriodo, idCarrera, 3),
        alumnosRegularizadosEnCuatrimestreDeMateriaSegunCantidad(idMateria, idPeriodo, idCarrera, 4),
        alumnosInscriptosEnCuatrimestreDeMateria(idMateria, idPeriodo, idCarrera),
        alumnosInscriptosEnCuatrimestreDeMateriaSegunCantidad(idMateria, idPeriodo, idCarrera, 1),
        alumnosInscriptosEnCuatrimestreDeMateriaSegunCantidad(idMateria, idPeriodo, idCarrera, 2),
        alumnosInscriptosEnCuatrimestreDeMateriaSegunCantidad(idMateria, idPeriodo, idCarrera, 3),
        alumnosInscriptosEnCuatrimestreDeMateriaSegunCantidad(idMateria, idPeriodo, idCarrera, 4)
    ]);

    const salida = {
        
        acumulado: {
            idPeriodo,
            regularizaron,
            inscriptos_1,
            inscriptos_2,
            inscriptos_3,
            inscriptos_4,
        },
        cuatrimestre: {
            idPeriodo,
            regularizaron_total,
            regularizaron_1,
            regularizaron_2,
            regularizaron_3,
            regularizaron_4,
            inscriptos_total,
            inscriptos_1: inscriptos_1_cuatrimestre,
            inscriptos_2: inscriptos_2_cuatrimestre,
            inscriptos_3: inscriptos_3_cuatrimestre,
            inscriptos_4: inscriptos_4_cuatrimestre
        }
    };

    return salida;
}

export async function obtenerCohorteMateria(req, res) {
    let idMateria = req.params.idMateria;
    let idPeriodo = req.params.idPeriodo;
    let idCarrera = req.params.idCarrera;

    //Para probar
    idCarrera = 38 //Lic en informatica
    idPeriodo = 13 //1C2018
    idMateria = 580 //Intro a la logica
    const idPeriodos = [13, 14, 18] //1C2018, 2C2018, 1C2019

    const response = {
        idMateria: idMateria,
        nombreMateria: "NOMBRE DE MATERIA",
        idPeriodo: idPeriodo,
        nombrePeriodo: "TERCER CUATRIMESTRE 1998",
        acumulado: [],
        cuatrimestre: []
    }

    const cuatrimestreData = await Promise.all(idPeriodos.map(async (idPeriodo) => {
        const materiaData = cohorteMateriaDePeriodo(idMateria, idPeriodo, idCarrera)
        return materiaData
    })) // => [{acumulado:{...}, cuatrimestre:{...}]

    response.acumulado = cuatrimestreData.map(cuatrimestre => cuatrimestre.acumulado)
    response.cuatrimestre = cuatrimestreData.map(cuatrimestre => cuatrimestre.cuatrimestre)

    res.status(200).json(response)


}

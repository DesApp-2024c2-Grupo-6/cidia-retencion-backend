import { getAlumnos, postAlumnosData } from "../services/alumnosService";
import { getMateria, getSubj } from "../services/materiasService";
import { subjectStatusSchema } from "../models/alumnos.schema";
import mongoose from "mongoose";
import { getPeriodo, getPeriodos } from "../services/periodosLectivosService";
import { getCarrera } from "../services/carrerasService";

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

    const periodo = await getPeriodo(idPeriodo)

    const cohorteData = {
        idPeriodo,
        nombrePeriodo: periodo.data.nombre,
        inscriptos: {},
        regularizaron: {},
        siguen: 0,
        abandonaron: 0,
        terminaron: 0,
        materiasData: []
    };

    // Filtrar alumnos que empezaron en este periodo
    const alumnosGuaraniPeriodoActual = alumnosGuarani.filter(
        (alumno) => alumno?.primerPeriodo?.periodoId === idPeriodo
    );

    cohorteData.terminaron = alumnosGuaraniPeriodoActual.filter((a) => a.egresado).length;

    // Prepara tareas en paralelo para inscriptos y regularizaron
    const inscriptosPromesas = [1, 2, 3, 4].map((n) => alumnosAnotadosAExactamenteMaterias(idPeriodo, n));
    const regularizaronPromesas = [1, 2, 3, 4].map((n) => alumnosRegulzarizadosExactamenteEnMaterias(idPeriodo, n));
    const [exactamenteUna, exactamenteDos, exactamenteTres, cuatroOMas] = await Promise.all(inscriptosPromesas);
    const [regExactamenteUna, regExactamenteDos, regExactamenteTres, regCuatroOMas] = await Promise.all(regularizaronPromesas);

    const sumFrom = (...args) => args.reduce((a, b) => a + b, 0);

    cohorteData.inscriptos = {
        exactamenteUna,
        exactamenteDos,
        exactamenteTres,
        cuatroMateriasOMas: cuatroOMas,
        unaMateria: sumFrom(exactamenteUna, exactamenteDos, exactamenteTres, cuatroOMas),
        dosMaterias: sumFrom(exactamenteDos, exactamenteTres, cuatroOMas),
        tresMaterias: sumFrom(exactamenteTres, cuatroOMas)
    };

    cohorteData.regularizaron = {
        exactamenteUna: regExactamenteUna,
        exactamenteDos: regExactamenteDos,
        exactamenteTres: regExactamenteTres,
        cuatroMateriasOMas: regCuatroOMas,
        unaMateria: sumFrom(regExactamenteUna, regExactamenteDos, regExactamenteTres, regCuatroOMas),
        dosMaterias: sumFrom(regExactamenteDos, regExactamenteTres, regCuatroOMas),
        tresMaterias: sumFrom(regExactamenteTres, regCuatroOMas)
    };

    // Abandonaron y siguen
    const abandonaron = await alumnosQueAbandonaron(idPeriodo, ultimosPeriodos);
    cohorteData.abandonaron = abandonaron;
    cohorteData.siguen = totalAlumnos - abandonaron - cohorteData.terminaron;

    // Materias: en paralelo

    cohorteData.materiasData = await Promise.all(
        materiasDeCarrera.map(async (materia) => ({
            idMateria: materia.id,
            nombre: materia.nombre,
            regularizaron: await alumnosConMateriaRegularizada(idPeriodo, materia.id)
        }))
    );

    return cohorteData;
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

async function cuatrimestresSiguientes(idPeriodo) {
    const periodos = (await getPeriodos()).data
    const cuatrimestres = periodos.filter(periodo => periodo.esCuatrimestre)
    const idCuatrimestres = cuatrimestres.map(cuatri => cuatri.periodoId)
    const idCuatrimestresOrdenados = idCuatrimestres.sort((a, b) => a - b)
    const indice = idCuatrimestresOrdenados.indexOf(idPeriodo);
    const siguientes = idCuatrimestresOrdenados.slice(indice, indice + 3);
    return siguientes
}

const ultimosPeriodos = async () => {
    const periodos = (await getPeriodos()).data
    const cuatrimestres = periodos.filter(periodo => periodo.esCuatrimestre)
    const ultimos = cuatrimestres.sort((a, b) => b.periodoId - a.periodoId)
    return [ultimos[2].periodoId, ultimos[1].periodoId, ultimos[0].periodoId]
}

export async function obtenerCohorteCarrera(req, res) {
    try {
        const idCarrera = await req.params.idCarrera;
        const idPeriodo = await req.params.idPeriodo
        //const idCarrera = 38 //Informatica
        //const idPeriodo = 13; //1C2018

        console.log(idCarrera, idPeriodo)

        const idPeriodos = await cuatrimestresSiguientes(Number(idPeriodo))

        const idUltimosPeriodos = await ultimosPeriodos()


        const materiasSinOrdenar = (await getSubj(idCarrera)).data.filter(materia => !materia.esUnahur) //Informatica

        const materiasDeCarrera = materiasSinOrdenar.sort((a, b) => a.nombre.localeCompare(b.nombre))

        const carrera = await getCarrera(idCarrera)

        const response = {
            totalAlumnos: 100000, //ARREGLAR
            idCarrera: idCarrera,
            idPeriodo: idPeriodo,
            nombreCarrera: carrera.data.nombre,
            nombrePeriodo: "",
            cohortes: [],
            msg: "Cohortes generadas correctamente"
        }

        const idsAlumnos = (await getAlumnos(idCarrera)).data
        const alumnosGuarani = (await postAlumnosData(idsAlumnos)).data
        //const SubjectStatus = mongoose.model('SubjectStatus', subjectStatusSchema);
        //Para todos los periodos
        const cohortesData = await Promise.all(idPeriodos.map(async (id) => {
            const cohorte = await cohorteDePeriodo(response.totalAlumnos, id, alumnosGuarani, materiasDeCarrera, idUltimosPeriodos)
            return cohorte;
        }))
        response.cohortes = cohortesData
        response.nombrePeriodo = cohortesData[0].nombrePeriodo

        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ msg: 'Error inesperado', error });

    }

}

//COHORTES MATERIAS

async function alumnosRegularizadosAcumuladosDeMateria(Schema, idMateria, idPeriodo, idCarrera) {


    const resultado = await Schema.aggregate([
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

async function alumnosInscriptosAcumuladosDeMateria(Schema, idMateria, idPeriodo, idCarrera, cantidadDeCursadas) {


    const cantidadCursadasCondition = cantidadDeCursadas < 4
        ? { $eq: cantidadDeCursadas }
        : { $gte: 4 };

    const resultado = await Schema.aggregate([
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

async function alumnosRegularizadosEnCuatrimestreDeMateria(Schema, idMateria, idPeriodo, idCarrera) {

    const resultado = await Schema.aggregate([
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

async function alumnosRegularizadosEnCuatrimestreDeMateriaSegunCantidad(Schema, idMateria, idPeriodo, idCarrera, cantidadCursadas) {

    const cantidadCursadasCond =
        cantidadCursadas < 4
            ? { $eq: cantidadCursadas }
            : { $gte: 4 };

    const resultado = await Schema.aggregate([
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

async function alumnosInscriptosEnCuatrimestreDeMateria(Schema, idMateria, idPeriodo, idCarrera) {

    const resultado = await Schema.aggregate([
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

async function alumnosInscriptosEnCuatrimestreDeMateriaSegunCantidad(Schema, idMateria, idPeriodo, idCarrera, cantidadCursadas) {

    const cantidadCursadasCond =
        cantidadCursadas < 4
            ? { $eq: cantidadCursadas }
            : { $gte: 4 };

    const resultado = await Schema.aggregate([
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



async function cohorteMateriaDePeriodo(Schema, idMateria, idPeriodo, idCarrera) {
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
        inscriptos_4_cuatrimestre
    ] = await Promise.all([
        getPeriodo(idPeriodo),
        alumnosRegularizadosAcumuladosDeMateria(Schema, idMateria, idPeriodo, idCarrera),
        alumnosInscriptosAcumuladosDeMateria(Schema, idMateria, idPeriodo, idCarrera, 1),
        alumnosInscriptosAcumuladosDeMateria(Schema, idMateria, idPeriodo, idCarrera, 2),
        alumnosInscriptosAcumuladosDeMateria(Schema, idMateria, idPeriodo, idCarrera, 3),
        alumnosInscriptosAcumuladosDeMateria(Schema, idMateria, idPeriodo, idCarrera, 4),
        alumnosRegularizadosEnCuatrimestreDeMateria(Schema, idMateria, idPeriodo, idCarrera),
        alumnosRegularizadosEnCuatrimestreDeMateriaSegunCantidad(Schema, idMateria, idPeriodo, idCarrera, 1),
        alumnosRegularizadosEnCuatrimestreDeMateriaSegunCantidad(Schema, idMateria, idPeriodo, idCarrera, 2),
        alumnosRegularizadosEnCuatrimestreDeMateriaSegunCantidad(Schema, idMateria, idPeriodo, idCarrera, 3),
        alumnosRegularizadosEnCuatrimestreDeMateriaSegunCantidad(Schema, idMateria, idPeriodo, idCarrera, 4),
        alumnosInscriptosEnCuatrimestreDeMateria(Schema, idMateria, idPeriodo, idCarrera),
        alumnosInscriptosEnCuatrimestreDeMateriaSegunCantidad(Schema, idMateria, idPeriodo, idCarrera, 1),
        alumnosInscriptosEnCuatrimestreDeMateriaSegunCantidad(Schema, idMateria, idPeriodo, idCarrera, 2),
        alumnosInscriptosEnCuatrimestreDeMateriaSegunCantidad(Schema, idMateria, idPeriodo, idCarrera, 3),
        alumnosInscriptosEnCuatrimestreDeMateriaSegunCantidad(Schema, idMateria, idPeriodo, idCarrera, 4)
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
            inscriptos_4: inscriptos_4_cuatrimestre
        }
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

        const idPeriodos = await cuatrimestresSiguientes(Number(idPeriodo))
        const materia = await getMateria(idCarrera, idMateria)
        const periodo = await getPeriodo(idPeriodo)

        const response = {
            idMateria: idMateria,
            nombreMateria: materia.data.nombre,
            idPeriodo: idPeriodo,
            nombrePeriodo: periodo.data.nombre,
            acumulado: [],
            cuatrimestre: [],
            msg: "Cohorte de materia generada"
        }

        const SubjectStatus = mongoose.model('SubjectStatus', subjectStatusSchema);

        const cuatrimestreData = await Promise.all(idPeriodos.map(async (idPeriodo) => {
            const materiaData = await cohorteMateriaDePeriodo(SubjectStatus, idMateria, idPeriodo, idCarrera)
            return materiaData
        })) // => [{acumulado:{...}, cuatrimestre:{...}]

        response.acumulado = cuatrimestreData.map(cuatrimestre => cuatrimestre.acumulado)
        response.cuatrimestre = cuatrimestreData.map(cuatrimestre => cuatrimestre.cuatrimestre)

        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ msg: 'Error inesperado', error });
    }

}

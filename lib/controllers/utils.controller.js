export function validarCampo(field) {

    return field === undefined ? undefined : (field === Number ? Number(field) : field )
}

export function construirFiltro(f) {
    let obj={};
    obj.id_carrera = f.id_carrera;
    obj.codigo_condicion = f.codigo_condicion;
    if(f.anio !== undefined){
        obj.anio = f.anio;
    }
    if(f.id_materia !== undefined){
        obj.id_materia = f.id_materia;
    }
    if(f.config_condicion !== undefined){
        obj.config_condicion = f.config_condicion;
    }
    return obj;
}
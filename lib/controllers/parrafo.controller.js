import mongoose from 'mongoose';
import { parrafoDataSchema } from '../models/parrafo.schema';
// Crear un nuevo párrafo
export async function createParrafo(req, res) {
  try {
    const parrafoModel = mongoose.model('parrafo', parrafoDataSchema);
    const { textId, _rawData } = req.body;
    console.log(req.body);
    const nuevoParrafo = new parrafoModel({
      textId,
      _rawData,
    });

    await nuevoParrafo.save();
    res.status(200).json(nuevoParrafo);
  } catch (error) {
    res.status(500).json({ error });
  }
}

// Obtener todos los párrafos
export async function getAllParrafos(req, res) {
  try {
    const parrafoModel = mongoose.model('parrafo', parrafoDataSchema);
    const allParrafos = await parrafoModel.find();
    if (allParrafos) {
      res.status(200).json({ allParrafos });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.log('estoy aca');
    res.status(500).json({ error });
  }
}

// Actualizar un párrafo existente por ID
export async function updateOneParrafo(req, res) {
  try {
    const parrafoModel = mongoose.model('parrafo', parrafoDataSchema);
    const { parrafoId } = req.query;
    const { textId, _rawData } = req.body;

    const updateParrafo = await parrafoModel.findByIdAndUpdate(
      parrafoId,
      { textId, _rawData },
      { new: true }
    );

    if (updateParrafo) {
      res.status(200).json(updateParrafo);
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error });
  }
} // Eliminar un párrafo por ID
export async function deleteOneParrafo(req, res) {
  try {
    const { key } = req.key; // Extrae el id de los parámetros de consulta de la solicitud
    const parrafoModel = mongoose.model('parrafo', parrafoDataSchema);
    const result = await parrafoModel.updateOne({
      $pull: { _rawData: { key: key } },
    });
    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({
          message: 'No se encontró ningún elemento con la clave proporcionada.',
        });
    }
    // Valida que el id es un ObjectId válido de MongoDB

    // Intenta encontrar y eliminar el párrafo por su ID
    // queda la lista sin el que queria eliminar
    //const ElimarTodoElObjeto = await parrafoModel.deleteMany();// elimina todo lo que hay en allparrafos
  } catch (error) {
    // En caso de error, responde con un código 500 y el error
    console.error('Error al eliminar el párrafo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

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

// Actualizar un párrafo existente por key
export async function updateOneParrafo(req, res) {
  try {
    const parrafoModel = mongoose.model('parrafo', parrafoDataSchema);
    const { key } = req.body;
    const updateFields = req.body.updateFields;

    const result = await parrafoModel.updateOne(
      { '_rawData.key': key },
      { $set: { '_rawData.$': updateFields } },
      { new: true }
    );

    if (result.nModified === 0) {
      return res
        .status(404)
        .json({
          message: 'No se encontró ningún elemento con la clave proporcionada.',
        });
    }

    res.status(200).json({ message: 'Elemento actualizado con éxito.' });
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando el elemento.', error });
  }
} // Eliminar un párrafo por ID
export async function deleteOneParrafo(req, res) {
  const { key } = req.body;
  try {
    console.log(key);
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

    res.status(200).json({ message: 'Elemento eliminado con éxito.' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando el elemento.', error });
  }
}

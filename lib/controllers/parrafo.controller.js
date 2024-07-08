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
    console.log('paso por el try linea 23');
    const parrafoModel = mongoose.model('parrafo', parrafoDataSchema);
    const allParrafos = await parrafoModel.find();

    console.log('paso por el try linea 25');
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
    const { parrafoId } = req.query;
    const { textId, _rawData } = req.body;

    const filtro = { _id: parrafoId };
    const objParrafo = {
      textId,
      _rawData: _rawData ? _rawData : [],
    };
    const updateParrafo = await parrafoDataSchema.findOneAndUpdate(
      filtro,
      objParrafo,
      { new: true }
    );
    if (updateParrafo) {
      res.status(200).json({ updateParrafo });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}

// Eliminar un párrafo por ID
export async function deleteOneParrafo(req, res) {
  const { key } = req.query;
  
  try {
    const parrafoModel = mongoose.model('parrafo', parrafoDataSchema);
    const result = await parrafoModel.updateOne(
       { $pull: { _rawData: { key: key } } }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'No se encontró ningún elemento con la clave proporcionada.' });
    }

    res.status(200).json({ message: 'Elemento eliminado con éxito.' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando el elemento.', error });
  }
}

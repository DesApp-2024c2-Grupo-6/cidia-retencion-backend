import mongoose from 'mongoose';
import { parrafoDataSchema } from '../models/parrafo.schema';
// Crear un nuevo párrafo

export async function createParrafo(req, res) {
  const { nuevaClave, nuevoTexto } = req.body;

  try {
    const Parrafo = mongoose.model('parrafo', parrafoDataSchema);
    const parrafosData = await Parrafo.findOne();

    parrafosData._rawData.unshift({
      key: nuevaClave,
      text: [nuevoTexto],
      conditions: [],
    });
    // Guarda los cambios en la base de datos
    await parrafosData.save();
    res
      .status(200)
      .json({ message: 'Párrafo agregado correctamente', parrafosData });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el párrafo', error });
  }
}

export async function updateAllParrafos(req, res) {
  //Pensado para cambiar el orden de los parrafos desde el front
  const { parrafos } = req.body;
  console.log(parrafos);
  try {
    const Parrafo = mongoose.model('parrafo', parrafoDataSchema);
    const parrafosData = await Parrafo.findOne();
    parrafosData._rawData = parrafos;
    await parrafosData.save();
    res.status(200).json({ message: 'Parrafos modificados', parrafosData });
  } catch (error) {
    res.status(500).json({ message: 'Error al modificar los parrafos', error });
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
    res.status(500).json({ error });
  }
}

export async function updateOneParrafo(req, res) {
  try {
    const parrafoModel = mongoose.model('parrafo', parrafoDataSchema);
    const { keyanterior, key, text, conditions } = req.body;
    const updatedParrafo = await parrafoModel.updateOne(
      { textId: 'suggestionMail', '_rawData.key': keyanterior },
      {
        $set: {
          '_rawData.$.conditions': conditions,
          '_rawData.$.text': text,
          '_rawData.$.key': key,
        },
      }
    );
    if (updatedParrafo) {
      res.status(200).json({ updatedParrafo });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando el elemento.', error });
  }
}
export async function deleteOneParrafo(req, res) {
  const { key } = req.body;
  try {
    const parrafoModel = mongoose.model('parrafo', parrafoDataSchema);
    const result = await parrafoModel.updateOne({
      $pull: { _rawData: { key: key } },
    });

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        message: 'No se encontró ningún elemento con la clave proporcionada.',
      });
    }

    res.status(200).json({ message: 'Elemento eliminado con éxito.' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando el elemento.', error });
  }
}

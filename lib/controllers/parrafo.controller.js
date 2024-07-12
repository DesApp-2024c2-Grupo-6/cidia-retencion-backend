import mongoose from 'mongoose';
import { parrafoDataSchema } from '../models/parrafo.schema';
// Crear un nuevo párrafo
export async function createParrafo(req, res) {
  //viene un objeto con Key y texto
  try {
    const parrafoModel = mongoose.model('parrafo', parrafoDataSchema);
    const result = await parrafoModel.updateOne(
      {textId: "suggestionMail"},
      { $push: {_rawData: {key: req.body.nuevaClave, text: req.body.nuevoTexto}}}
    );
    res.status(200).json(result);
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


export async function updateOneParrafo(req, res) {
  try {

    const parrafoModel = mongoose.model('parrafo', parrafoDataSchema);
    const { key, text, conditions } = req.body;
    console.log(req.body)
    const updatedParrafo = await parrafoModel.updateOne(
      {textId: "suggestionMail", '_rawData.key': key},
      {$set: {'_rawData.$.conditions': conditions, '_rawData.$.text': text, '_rawData.$.key': key}}
    );
    console.log("lo actualizo ponele ¿?")
    if (updatedParrafo) {
      res.status(200).json({ updatedParrafo });
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

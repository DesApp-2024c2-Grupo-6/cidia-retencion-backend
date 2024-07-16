import mongoose from 'mongoose';
import { parrafoDataSchema } from '../models/parrafo.schema';
// Crear un nuevo párrafo


export async function createParrafo(req, res) {
  const { parrafoId, nuevaClave, nuevoTexto } = req.body;
  console.log(parrafoId);
  console.log(nuevaClave);
  console.log(nuevoTexto);
  try {
    const Parrafo = mongoose.model('parrafo', parrafoDataSchema); // Obtén el modelo de tu esquema
    // Encuentra el documento específico por su _id
    const parrafo = await Parrafo.findById(parrafoId);

    if (!parrafo) {
      return res.status(404).json({
        message: 'No se encontró el párrafo con el ID proporcionado.',
      });
    }

    // Agrega el nuevo párrafo al array _rawData
    parrafo._rawData.push({
      key: nuevaClave,
      text: [nuevoTexto], // Puedes inicializar el array con el nuevo texto
      conditions: [], // Puedes manejar condiciones si es necesario
    });

    // Guarda los cambios en la base de datos
    await parrafo.save();

    res
      .status(200)
      .json({ message: 'Párrafo agregado correctamente', parrafo });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el párrafo', error });
  }
}
//export async function createParrafo(req, res) {
//  try {
//    const parrafoModel = mongoose.model('parrafo', parrafoDataSchema);
//    const { textId, _rawData } = req.body;
//    console.log(req.body);
//    const nuevoParrafo = new parrafoModel({
//      textId,
//      _rawData,
//    });

//    await nuevoParrafo.save();
//    res.status(200).json(nuevoParrafo);
//  } catch (error) {
//    res.status(500).json({ error });
//  }
//}

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
  const { key } = req.body;
  const parrafo1 = mongoose.model('parrafo', parrafoDataSchema);
  const updateFields = req.body;
  try {
    console.log('Update request received for key:', key);
    console.log('Update fields:', req.body);
    // Encuentra el documento que coincida con la clave proporcionada en _rawData.key
    const parrafo = await parrafo1.findOne({ '_rawData.key': key });
    console.log(parrafo)
    if (!parrafo) {
      return res.status(404).json({
        message: 'No se encontró ningún elemento con la clave proporcionada.',
      });
    }

    // Actualiza el campo específico dentro del array _rawData
    const index = parrafo._rawData.findIndex((item) => item.key === key);
    if (index === -1) {
      return res.status(404).json({
        message: 'No se encontró ningún elemento con la clave proporcionada.',
      });
    }

    // Actualiza el elemento específico dentro del array _rawData
    parrafo._rawData[index].key = updateFields.key;
    parrafo._rawData[index].text = updateFields.text;

    // Guarda los cambios actualizados en la base de datos
    console.log(parrafo)
    await parrafo.save();
    console.log('Update successful.');
    res.status(200).json({ message: 'Párrafo actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando el elemento.', error });
  }
}
export async function deleteOneParrafo(req, res) {
  console.log("entra")
  const { key } = req.body;
  try {
    console.log(key);
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
import mongoose, { Types, mongo } from "mongoose";
import {parrafoDataSchema} from '../models/parrafos.schema';
// Crear un nuevo párrafo
export async function createParrafo(req, res) {
    try {
        const { textId, _rawData } = req.body;

        const nuevoParrafo = new parrafoDataSchema({
            textId,
            _rawData
        });

        await nuevoParrafo.save();
        res.status(200).json(nuevoParrafo);
    } catch (error) {
        res.status(500).json({ error });
    }
};

// Obtener todos los párrafos
export async function getAllParrafos(req, res) {
    try {
        const allParrafos = await parrafoDataSchema.find();
        if (allParrafos) {
            res.status(200).json({ allParrafos });
        } else {
            res.status(204).send();
        }
    } catch (error) {
        res.status(500).json({ error });
    }
}

// Actualizar un párrafo existente por ID
export async function updateOneParrafo(req, res) {
    try {
        const { parrafoId } = req.params;
        const { textId, _rawData } = req.body;

        const filtro = { _id: parrafoId };
        const objParrafo = {
            textId,
            _rawData: _rawData ? _rawData : []
        };
        const updateParrafo = await parrafoDataSchema.findOneAndUpdate(filtro, objParrafo, { new: true });
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
    try {
        const { parrafoId } = req.params;
        const filtro = { _id: parrafoId };
        const eliminadaParrafo = await parrafoDataSchema.findOneAndDelete(filtro);
        if (eliminadaParrafo) {
            res.status(200).json({ eliminadaParrafo });
        } else {
            res.status(204).send();
        }
    } catch (error) {
        res.status(500).json({ error });
    }
}
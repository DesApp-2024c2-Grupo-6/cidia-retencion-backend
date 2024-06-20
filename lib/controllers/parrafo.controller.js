const { getCurrentConfigParrafo, updateOneParrafo, getAllParrafos } = require('../services/parrafoService');

exports.getCurrentConfigParrafo = async (req, res) => {
    const { parrafoId } = req.params;
    try {
        const config = await getCurrentConfigParrafo(parrafoId);
        res.status(200).json(config);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching paragraph config', error });
    }
};

exports.updateOneParrafo = async (req, res) => {
    const data = req.body;
    try {
        const updatedParrafo = await updateOneParrafo(data);
        res.status(200).json(updatedParrafo);
    } catch (error) {
        res.status(500).json({ message: 'Error updating paragraph', error });
    }
};

exports.getAllParrafos = async (req, res) => {
    try {
        const parrafos = await getAllParrafos();
        res.status(200).json(parrafos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all paragraphs', error });
    }
};
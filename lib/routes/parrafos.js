const express = require('express');
const router = express.Router();
const parrafoController = require('../controllers/parrafoController');

router.get('/:parrafoId', parrafoController.getCurrentConfigParrafo);
router.put('/', parrafoController.updateOneParrafo);
router.get('/', parrafoController.getAllParrafos);

module.exports = router;

export const getAllParrafos = async () => {
    try {
        const response = await axios.get(`${baseURL}/parrafos`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
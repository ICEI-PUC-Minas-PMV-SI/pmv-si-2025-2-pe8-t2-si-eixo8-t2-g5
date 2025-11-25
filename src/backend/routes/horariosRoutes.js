const express = require('express');
const router = express.Router();
const horariosController = require('../controllers/horariosController');

router.get('/config', horariosController.getHorariosConfig);


router.put('/config', horariosController.updateHorariosConfig);

module.exports = router;
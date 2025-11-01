const express = require('express');
const router = express.Router();
const historicoController = require('../controllers/historicoController');
const{ autenticarToken } = require('../middlewares/authMiddleware');
router.get('/dashboard', autenticarToken, historicoController.getDashboardData);
router.get('/relatorio-pdf', autenticarToken, historicoController.gerarRelatorioPDF);


module.exports = router;
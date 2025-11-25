// routes/desempenhoRoutes.js

const express = require('express');
const router = express.Router();
const desempenhoController = require('../controllers/desempenhoController');
const { autenticarToken } = require('../middlewares/authMiddleware');

router.get('/servicos', autenticarToken, desempenhoController.getDesempenhoServicos);
router.get('/trends', autenticarToken, desempenhoController.getServiceTrends);

module.exports = router;
const express = require('express');
const router = express.Router();

const clienteController = require('../controllers/clienteController');
const { autenticarToken } = require('../middlewares/authMiddleware');

router.get('/', autenticarToken, clienteController.getClientes);

router.post('/', autenticarToken, clienteController.createCliente);

module.exports = router;
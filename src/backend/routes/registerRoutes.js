const express = require('express');
const router = express.Router();

const authController = require('../controllers/register');


router.post('/register', authController.criarUsuario);


module.exports = router;
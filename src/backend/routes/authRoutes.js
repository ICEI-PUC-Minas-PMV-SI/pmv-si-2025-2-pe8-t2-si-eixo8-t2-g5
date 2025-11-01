const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const cors = require('../config/cors'); 

router.post('/autenticar', cors, authController.autenticar);

module.exports = router;
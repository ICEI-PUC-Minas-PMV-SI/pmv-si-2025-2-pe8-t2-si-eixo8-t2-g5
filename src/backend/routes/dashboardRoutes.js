const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');
const { autenticarToken } = require('../middlewares/authMiddleware');


router.get('/stats', autenticarToken, dashboardController.getDashboardStats);

module.exports = router;

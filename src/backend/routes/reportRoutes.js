const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { autenticarToken } = require('../middlewares/authMiddleware');

/**
 * @route   GET /api/reports/billing
 * @desc    Gera um relatório de faturamento com base nos filtros
 * @access  Private (Admin)
 * @query   startDate (string: 'YYYY-MM-DD')
 * @query   endDate (string: 'YYYY-MM-DD')
 * @query   serviceId (string: '0' para todos, ou '1', '2', etc.)
 */
router.get('/billing', autenticarToken, reportController.getBillingReport);

module.exports = router;

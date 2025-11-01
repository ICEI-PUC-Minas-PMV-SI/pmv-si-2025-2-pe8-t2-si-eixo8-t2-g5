const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const { autenticarToken } = require('../middlewares/authMiddleware');

router.get('/agendamentos', autenticarToken, adminController.getAgendamentos);

router.patch('/agendamentos/:id/status', autenticarToken, adminController.updateStatusAgendamento);

router.patch('/agendamentos/:id/pagamento', autenticarToken, adminController.updatePagamentoAgendamento);

router.delete('/agendamentos/:id', autenticarToken, adminController.deleteAgendamento);

router.get('/horarios-config', autenticarToken, adminController.getHorariosConfig);

router.put('/horarios-config', autenticarToken, adminController.updateHorariosConfig);

router.get('/agenda-semana', autenticarToken, adminController.getAgendaSemana);

module.exports = router;
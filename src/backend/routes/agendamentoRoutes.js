const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agendamentoController');

// Get all appointments with filters
router.get('/', agendamentoController.getAgendamentos);

// Get available time slots for booking
router.get('/horarios', agendamentoController.getHorariosDisponiveis);

// Get week schedule
router.get('/semana', agendamentoController.getAgendaSemana);

// Create new appointment
router.post('/', agendamentoController.criarAgendamento);

// Update appointment status
router.put('/:id/status', agendamentoController.updateStatusAgendamento);

// Update appointment payment
router.put('/:id/pagamento', agendamentoController.updatePagamentoAgendamento);

// Delete appointment
router.delete('/:id', agendamentoController.deleteAgendamento);

module.exports = router;
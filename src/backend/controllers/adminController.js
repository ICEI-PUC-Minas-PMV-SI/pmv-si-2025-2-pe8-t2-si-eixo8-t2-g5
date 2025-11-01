const db = require('../config/db');
const dayjs = require('dayjs');
require('dayjs/locale/pt-br');
dayjs.locale('pt-br');

exports.getAgendamentos = async (req, res) => {
  const { search, date, service, status } = req.query;
  
  let query = `
    SELECT id, nome_cliente, servico, 
           TO_CHAR(data_hora, 'DD/MM/YYYY') as data,
           TO_CHAR(data_hora, 'HH24:MI') as hora,
           status,
           pagamento
    FROM agendamentos
    WHERE 1=1 
  `;
  const values = [];
  let paramIndex = 1;

  if (search) {
    query += ` AND (nome_cliente ILIKE $${paramIndex} OR servico ILIKE $${paramIndex})`;
    values.push(`%${search}%`);
    paramIndex++;
  }
  if (date) {
    query += ` AND DATE(data_hora) = $${paramIndex}`;
    values.push(date); 
    paramIndex++;
  }
  if (service) {
    query += ` AND servico = $${paramIndex}`;
    values.push(service);
    paramIndex++;
  }
  if (status) {
    query += ` AND status = $${paramIndex}`;
    values.push(status);
    paramIndex++;
  }

  query += ` ORDER BY data_hora DESC;`;

  try {
    const result = await db.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar agendamentos com filtros:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

exports.updateStatusAgendamento = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'O novo status é obrigatório.' });
  }

  try {
    const query = `
      UPDATE agendamentos 
      SET status = $1 
      WHERE id = $2
      RETURNING *;
    `;
    const result = await db.query(query, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }

    res.status(200).json({ message: 'Status atualizado com sucesso!', agendamento: result.rows[0] });
  
  } catch (err) {
    console.error('Erro ao atualizar status:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

exports.updatePagamentoAgendamento = async (req, res) => {
    const { id } = req.params;
    const { pagamento } = req.body;

    if (!pagamento) {
        return res.status(400).json({ message: 'O novo status de pagamento é obrigatório.' });
    }

    try {
        const result = await db.query(
            'UPDATE agendamentos SET pagamento = $1 WHERE id = $2 RETURNING *',
            [pagamento, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Agendamento não encontrado.' });
        }
        res.status(200).json({ message: 'Pagamento atualizado!', agendamento: result.rows[0] });
    } catch (err) {
        console.error('Erro ao atualizar pagamento:', err);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};

exports.deleteAgendamento = async (req, res) => {
  const { id } = req.params;

  try {
    const query = "DELETE FROM agendamentos WHERE id = $1 RETURNING *;";
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }

    res.status(200).json({ message: 'Agendamento deletado com sucesso!' });

  } catch (err) {
    console.error('Erro ao deletar agendamento:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

exports.getHorariosConfig = async (req, res) => {
  try {
    const result = await db.query('SELECT periodo, hora_inicio, hora_fim FROM horarios_configuracao WHERE ativo = true');
    
    const config = {};
    result.rows.forEach(row => {
      config[row.periodo] = {
        inicio: dayjs(row.hora_inicio, 'HH:mm:ss').format('HH:mm'), 
        fim: dayjs(row.hora_fim, 'HH:mm:ss').format('HH:mm')
      };
    });

    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar configurações.', error: error.message });
  }
};

exports.updateHorariosConfig = async (req, res) => {
  try {
    const { periodo, inicio, fim } = req.body;

    if (!periodo || !inicio || !fim) {
      return res.status(400).json({ message: 'Dados incompletos (periodo, inicio, fim).' });
    }

    const query = 'UPDATE horarios_configuracao SET hora_inicio = $1, hora_fim = $2 WHERE periodo = $3 RETURNING *';
    const result = await db.query(query, [inicio, fim, periodo]);

    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Período não encontrado.' });
    }

    res.status(200).json({ 
        message: 'Horário atualizado!', 
        config: {
            periodo: result.rows[0].periodo,
            inicio: dayjs(result.rows[0].hora_inicio, 'HH:mm:ss').format('HH:mm'),
            fim: dayjs(result.rows[0].hora_fim, 'HH:mm:ss').format('HH:mm')
        } 
    });

  } catch (error) {
    res.status(500).json({ message: 'Erro ao salvar configuração.', error: error.message });
  }
};

exports.getAgendaSemana = async (req, res) => {
  try {
    const { date, serviceId, status, search } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'A data é obrigatória.' });
    }

    const getWeekRange = (date) => {
      const startOfWeek = dayjs(date).startOf('day').day(1);
      const endOfWeek = dayjs(date).startOf('day').day(6);
      
      return {
        start: startOfWeek.format('YYYY-MM-DD 00:00:00'),
        end: endOfWeek.format('YYYY-MM-DD 23:59:59'),
      };
    };

    const week = getWeekRange(date);

    let params = [week.start, week.end];
    let query = `
      SELECT 
        a.id, 
        a.data_hora, 
        a.nome_cliente, 
        a.status,
        s.name AS serviceName
      FROM 
        agendamentos a
      LEFT JOIN 
        servicos s ON a.servico::int = s.id
      WHERE 
        a.data_hora >= $1 AND a.data_hora <= $2
    `;
    let paramIndex = 3;

    if (serviceId && serviceId !== '0') {
      query += ` AND a.servico::int = $${paramIndex++}`;
      params.push(serviceId);
    }
    if (status && status !== '0') {
      const statusMap = { '1': 'pendente', '2': 'confirmado', '3': 'concluido' };
      if(statusMap[status]) {
        query += ` AND a.status = $${paramIndex++}`;
        params.push(statusMap[status]);
      }
    }
    if (search && search !== '') {
      query += ` AND a.nome_cliente ILIKE $${paramIndex++}`;
      params.push(`%${search}%`);
    }

    const agendamentosResult = await db.query(query, params);
    const agendamentos = agendamentosResult.rows;

    const configResult = await db.query('SELECT hora_inicio, hora_fim FROM horarios_configuracao WHERE ativo = true');
    const configRows = configResult.rows;
    
    const timeSlots = [];
    for (let hour = 8; hour < 22; hour++) { 
      timeSlots.push(dayjs().hour(hour).minute(0).format('HH:mm'));
    }

    const grid = [];
    
    for (const slotStart of timeSlots) {
      const slotRow = [];
      const slotStartTime = parseInt(slotStart.split(':')[0]);

      for (let dayIndex = 1; dayIndex <= 6; dayIndex++) {
        const currentDay = dayjs(date).day(dayIndex);
        
        const appointment = agendamentos.find(app => {
          const appDate = dayjs(app.data_hora);
          return appDate.isSame(currentDay, 'day') && appDate.hour() === slotStartTime;
        });

        if (appointment) {
          slotRow.push({
            status: 'Ocupado',
            appId: appointment.id,
            cliente: appointment.nome_cliente,
            servico: appointment.serviceName,
            statusApp: appointment.status,
          });
        } else {
          const isWorkingTime = configRows.some(config => {
             const inicio = parseInt(config.hora_inicio.split(':')[0]);
             const fim = parseInt(config.hora_fim.split(':')[0]);
             return slotStartTime >= inicio && slotStartTime < fim;
          });

          if (isWorkingTime) {
            slotRow.push({ status: 'Disponível' });
          } else {
            slotRow.push({ status: 'Bloqueado' });
          }
        }
      }
      grid.push(slotRow);
    }

    const displayTimeSlots = timeSlots.map(slot => {
      const start = slot;
      const end = dayjs().hour(parseInt(slot.split(':')[0]) + 1).minute(0).format('HH:mm');
      return `${start} - ${end}`;
    });

    res.status(200).json({ timeSlots: displayTimeSlots, grid });

  } catch (error) {
    console.error('Erro ao buscar agenda da semana:', error);
    res.status(500).json({ message: 'Erro ao buscar agenda.', error: error.message });
  }
};
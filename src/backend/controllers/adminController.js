const db = require('../config/db');
const dayjs = require('dayjs');
require('dayjs/locale/pt-br');
dayjs.locale('pt-br');

// --- Funções de Admin (Com filtro de Pagamento e Agendamento unificados) ---

exports.getAgendamentos = async (req, res) => {
  // Adicionado 'paymentStatus' (para o filtro de pagamento no front-end)
  const { search, date, service, status, paymentStatus } = req.query;
  
  let query = `
    SELECT 
      a.id, 
      a.nome_cliente AS cliente, 
      s.name AS servico,
      s.min_price AS valor, -- USANDO min_price DO SERVIÇO COMO VALOR PAGO ESTIMADO
      TO_CHAR(a.data_hora, 'DD/MM/YYYY') as dataPagamento,
      a.data_hora,
      a.status AS statusAgendamento, -- Status do agendamento (pendente, concluido)
      a.pagamento AS status         -- Status do pagamento (pago, pendente)
    FROM 
      agendamentos AS a
    LEFT JOIN 
      services AS s ON a.servico::int = s.id
    WHERE 1=1 
  `;
  const values = [];
  let paramIndex = 1;

  if (search) {
    query += ` AND (a.nome_cliente ILIKE $${paramIndex} OR s.name ILIKE $${paramIndex})`; 
    values.push(`%${search}%`);
    paramIndex++;
  }
  if (date) {
    query += ` AND DATE(a.data_hora) = $${paramIndex}`;
    values.push(date); 
    paramIndex++;
  }
  if (service && service !== '0') { 
    query += ` AND a.servico::int = $${paramIndex}`;
    values.push(service);
    paramIndex++;
  }
  
  // Filtro de Status do Agendamento (original)
  if (status && status !== '0') {
    query += ` AND a.status ILIKE $${paramIndex}`;
    values.push(status);
    paramIndex++;
  }
  
  // NOVO: Filtro de Status de Pagamento (usado na tela de Pagamentos)
  if (paymentStatus && paymentStatus !== 'all') {
    query += ` AND a.pagamento ILIKE $${paramIndex}`;
    values.push(paymentStatus);
    paramIndex++;
  }


  query += ` ORDER BY a.data_hora DESC;`;

  try {
    const result = await db.query(query, values);
    
    // Mapeamento final para garantir que o valor seja float e formatar as chaves para o front-end
    const formattedRows = result.rows.map(row => ({
        ...row,
        valor: parseFloat(row.valor || 0), 
    }));

    res.status(200).json(formattedRows);
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
        s.name AS servicename,
        s.id AS serviceid
      FROM 
        agendamentos a
      LEFT JOIN 
        services s ON a.servico::int = s.id
      WHERE 
        a.data_hora >= $1 AND a.data_hora <= $2
    `;
    let paramIndex = 3;

    if (serviceId && serviceId !== '0') {
      query += ` AND a.servico::int = $${paramIndex++}`;
      params.push(serviceId);
    }
    if (status && status !== '0') {
      const statusMap = { '1': 'Pendente', '2': 'Confirmado', '3': 'Concluído' }; 
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
    
    // Generate time slots with 30-minute intervals
    const timeSlots = [];
    for (let hour = 8; hour < 22; hour++) { 
      timeSlots.push(dayjs().hour(hour).minute(0).format('HH:mm'));
      timeSlots.push(dayjs().hour(hour).minute(30).format('HH:mm'));
    }

    const grid = [];
    
    for (const slotStart of timeSlots) { 
      const slotRow = [];
      const [slotHour, slotMinute] = slotStart.split(':').map(Number);

      for (let dayIndex = 1; dayIndex <= 6; dayIndex++) { 
        const currentDay = dayjs(date).day(dayIndex);
        
        // Find appointment that matches this day and time slot
        const appointment = agendamentos.find(app => {
          const appDate = dayjs(app.data_hora);
          return appDate.isSame(currentDay, 'day') && 
                 appDate.hour() === slotHour && 
                 appDate.minute() === slotMinute;
        });

        if (appointment) {
          slotRow.push({
            status: 'Ocupado',
            appId: appointment.id,
            cliente: appointment.nome_cliente,
            servico: appointment.servicename || 'Serviço não especificado',
            servicoId: appointment.serviceid,
            statusApp: appointment.status,
          });
        } else {
          // Check if this time slot is within working hours
          const isWorkingTime = configRows.some(config => {
            const inicioHour = parseInt(config.hora_inicio.split(':')[0]); 
            const inicioMinute = parseInt(config.hora_inicio.split(':')[1]); 
            const fimHour = parseInt(config.hora_fim.split(':')[0]);
            const fimMinute = parseInt(config.hora_fim.split(':')[1]);
            
            const slotMinutes = slotHour * 60 + slotMinute;
            const inicioMinutes = inicioHour * 60 + inicioMinute;
            const fimMinutes = fimHour * 60 + fimMinute;
            
            return slotMinutes >= inicioMinutes && slotMinutes < fimMinutes;
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

    // Format display time slots
    const displayTimeSlots = timeSlots.map(slot => {
      const [hour, minute] = slot.split(':').map(Number);
      const endMinute = minute + 30;
      const endHour = hour + Math.floor(endMinute / 60);
      const finalMinute = endMinute % 60;
      
      const end = `${String(endHour).padStart(2, '0')}:${String(finalMinute).padStart(2, '0')}`;
      return `${slot} - ${end}`;
    });

    res.status(200).json({ timeSlots: displayTimeSlots, grid });

  } catch (error) {
    console.error('Erro ao buscar agenda da semana:', error);
    res.status(500).json({ message: 'Erro ao buscar agenda.', error: error.message });
  }
};;
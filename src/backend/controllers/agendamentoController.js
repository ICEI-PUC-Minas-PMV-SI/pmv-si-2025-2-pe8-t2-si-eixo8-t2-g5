const db = require('../config/db');

exports.criarAgendamento = async (req, res) => {
  const { name, whatsapp, service, date, time } = req.body;

  if (!name || !whatsapp || !service || !date || !time) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  const dataHora = `${date} ${time}:00`;

  try {
    const query = `
      INSERT INTO agendamentos (nome_cliente, whatsapp, servico, data_hora, status)
      VALUES ($1, $2, $3, $4, 'pendente')
      RETURNING *; 
    `;
    const values = [name, String(whatsapp), service, dataHora];
    const result = await db.query(query, values);

    res.status(201).json({ 
      message: 'Agendamento criado com sucesso! Aguarde a confirmação.', 
      agendamento: result.rows[0] 
    });

  } catch (err) {
    console.error('Erro ao criar agendamento:', err);
    res.status(500).json({ message: 'Erro interno no servidor ao tentar agendar.' });
  }
};

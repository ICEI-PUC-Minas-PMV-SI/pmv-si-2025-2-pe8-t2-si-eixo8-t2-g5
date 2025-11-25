const db = require('../config/db');
const bcrypt = require('bcrypt');

// GET /api/clientes (com busca)
exports.getClientes = async (req, res) => {
  const { search } = req.query;

  let query = `
    SELECT 
      u.id, 
      u.nome, 
      u.tipo, 
      u.plano_servicos, 
      COUNT(h.id) AS total_servicos
    FROM 
      usuarios u
    LEFT JOIN 
      historico_servicos h ON u.id = h.usuario_id
  `;
  
  const values = [];
  if (search) {
    query += ` WHERE u.nome ILIKE $1 OR u.email ILIKE $1`;
    values.push(`%${search}%`);
  }

  query += `
    GROUP BY 
      u.id, u.nome, u.tipo, u.plano_servicos
    ORDER BY 
      u.nome;
  `;

  try {
    const result = await db.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar clientes:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// POST /api/clientes (para o botão "Adicionar cliente")
exports.createCliente = async (req, res) => {
  const { nome, email, senha, tipo, plano_servicos } = req.body;

  if (!nome || !email || !senha || !tipo) {
    return res.status(400).json({ message: 'Nome, email, senha e tipo são obrigatórios.' });
  }

  try {
    const hash = await bcrypt.hash(senha, 10);

    const plano = (tipo === 'Mensalista' && plano_servicos) ? parseInt(plano_servicos, 10) : null;

    const query = `
      INSERT INTO usuarios (nome, email, senha, tipo, plano_servicos)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, nome, email, tipo, plano_servicos
    `;
    const values = [nome, email, hash, tipo, plano];

    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);

  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Este email já está cadastrado.' });
    }
    console.error('Erro ao criar cliente:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

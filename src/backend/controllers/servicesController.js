const db = require('../config/db');


exports.getAllServices = async (req, res) => {
  try {
   
    const query = 'SELECT id, name FROM servicos ORDER BY name ASC';
    const result = await db.query(query);
    
    res.status(200).json(result.rows);

  } catch (err) {
    console.error('Erro ao buscar serviços:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};
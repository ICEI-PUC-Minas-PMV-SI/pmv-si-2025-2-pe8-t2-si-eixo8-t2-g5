const db = require('../config/db');

exports.getAllServices = async (req, res) => {
  try {
   
    const query = 'SELECT id, name, min_price, duration_minutes FROM services ORDER BY name ASC';
    const result = await db.query(query);
    
  
    const formattedRows = result.rows.map(row => ({
        ...row,
        duration_minutes: parseInt(row.duration_minutes, 10),
        min_price: parseFloat(row.min_price)
    }));
    
    res.status(200).json(formattedRows);

  } catch (err) {
    console.error('Erro ao buscar serviços:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};
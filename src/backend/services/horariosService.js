const db = require('../config/db'); 

const fetchHorariosConfig = async () => {

  const { rows } = await db.query('SELECT periodo, hora_inicio, hora_fim FROM horarios_configuracao WHERE ativo = true');
  
  const config = {};
  rows.forEach(row => {
    config[row.periodo] = {
      inicio: row.hora_inicio, 
      fim: row.hora_fim      
    };
  });
  
  return config;
};

const saveHorariosConfig = async (periodo, inicio, fim) => {
  const query = 'UPDATE horarios_configuracao SET hora_inicio = $1, hora_fim = $2 WHERE periodo = $3';
  await db.query(query, [inicio, fim, periodo]);
  

  return await fetchHorariosConfig(); 
};

module.exports = {
  fetchHorariosConfig,
  saveHorariosConfig,
};
const { Pool } = require('pg');
require('dotenv').config();

// O 'Pool' gerencia as conexões para o PostgreSQL
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// Mensagem para sabermos que conectou
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Erro ao conectar ao banco de dados PostgreSQL:', err.stack);
  }
  console.log('✅ Conectado ao banco de dados PostgreSQL!');
  release(); // Libera o cliente de volta para o pool
});

// Exporta um objeto 'query' que usa o pool
module.exports = {
  query: (text, params) => pool.query(text, params),
};
const { Pool } = require('pg');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

const runMigrations = async (client) => {
  try {
    console.log('Tabelas não encontradas. Executando script de migração...');
    
    const sql = fs.readFileSync(path.join(__dirname, '..', 'database', '001_initial_schema.sql'), 'utf8');
    
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    
    console.log('Migração concluída: Tabelas criadas com sucesso!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('ERRO ao executar a migração:', error.message);
    throw error;
  }
};

pool.connect(async (err, client, release) => {
  if (err) {
    return console.error('Erro ao conectar ao banco de dados PostgreSQL:', err.stack);
  }
  
  console.log('Conectado ao banco de dados PostgreSQL!');

  try {
    await client.query('SELECT 1 FROM usuarios LIMIT 1');
    console.log('... Estrutura do DB já existe.');
    
  } catch (error) {
    if (error.code === '42P01') { 
      try {
        await runMigrations(client);
      } catch (migrationError) {
        console.error('Falha crítica durante a migração. Verifique o console.');
      }
    } else {
      console.error('Erro inesperado ao checar o DB:', error.message);
    }
  } finally {
    release();
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
// controllers/desempenhoController.js

const db = require('../config/db');

exports.getDesempenhoServicos = async (req, res) => {
    try {
        
        const queryDesempenho = `
            SELECT
                hs.servico,
                COUNT(DISTINCT hs.usuario_id) AS clientes_atendidos,
                SUM(hs.preco) AS receita_gerada,
                COUNT(hs.id) AS popularidade_count
            FROM historico_servicos hs
            GROUP BY hs.servico
            ORDER BY popularidade_count DESC;
        `;
        
        const result = await db.query(queryDesempenho);

        
        const formattedData = result.rows.map(row => ({
            servico: row.servico,
            clientes: parseInt(row.clientes_atendidos, 10),
            receita: parseFloat(row.receita_gerada).toFixed(2),
            recorrencia: 'XX%', 
            popularidade: parseInt(row.popularidade_count, 10), 
        }));

        res.status(200).json(formattedData);
    } catch (err) {
        console.error('Erro ao buscar desempenho de serviços:', err);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};
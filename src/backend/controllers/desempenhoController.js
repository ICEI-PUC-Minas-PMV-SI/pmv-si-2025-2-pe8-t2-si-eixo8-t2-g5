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

exports.getServiceTrends = async (req, res) => {
    try {
        const queryServiceCount = `
            SELECT
                s.name AS servico,
                COUNT(a.id) AS total_agendamentos
            FROM agendamentos a
            INNER JOIN services s ON a.servico = s.id
            GROUP BY s.name
            ORDER BY total_agendamentos DESC;
        `;

        const serviceCountResult = await db.query(queryServiceCount);

        const queryServiceTrends = `
            SELECT
                TO_CHAR(data_hora, 'YYYY-MM') AS mes_ano,
                COUNT(*) AS total_agendamentos
            FROM agendamentos
            WHERE data_hora >= (CURRENT_DATE - INTERVAL '5 months')
            GROUP BY mes_ano
            ORDER BY mes_ano ASC
            LIMIT 6;
        `;

        const trendsResult = await db.query(queryServiceTrends);

        const serviceCountData = serviceCountResult.rows.map(row => ({
            servico: row.servico,
            total: parseInt(row.total_agendamentos, 10)
        }));

        const trendsData = {
            labels: trendsResult.rows.map(r => r.mes_ano),
            data: trendsResult.rows.map(r => parseInt(r.total_agendamentos, 10))
        };

        res.status(200).json({
            serviceCount: serviceCountData,
            trends: trendsData
        });
    } catch (err) {
        console.error('Erro ao buscar tendências de serviços:', err);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};

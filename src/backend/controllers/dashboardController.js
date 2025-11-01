const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  const usuarioId = req.user.id;

  try {
    const faturamentoQuery = `
      SELECT SUM(preco) AS total
      FROM historico_servicos
      WHERE EXTRACT(MONTH FROM data) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM data) = EXTRACT(YEAR FROM CURRENT_DATE);
    `;
    const faturamentoResult = await db.query(faturamentoQuery);
    const faturamentoMes = parseFloat(faturamentoResult.rows[0].total || 0);

    const servicosQuery = `
      SELECT servico, COUNT(servico) AS contagem
      FROM historico_servicos
      GROUP BY servico
      ORDER BY contagem DESC
      LIMIT 3;
    `;
    const servicosResult = await db.query(servicosQuery);
    const servicosMaisProcurados = servicosResult.rows.map(r => r.servico);

    const clientesQuery = `
      SELECT COUNT(*) AS total
      FROM usuarios
      WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE);
    `;
    const clientesResult = await db.query(clientesQuery);
    const novosClientesMes = parseInt(clientesResult.rows[0].total || 0);

    const agendamentosChartQuery = `
      SELECT
        TO_CHAR(data_hora, 'YYYY-MM') AS mes_ano,
        COUNT(*) AS total
      FROM agendamentos
      WHERE data_hora >= (CURRENT_DATE - INTERVAL '5 months')
      GROUP BY mes_ano
      ORDER BY mes_ano ASC
      LIMIT 6;
    `;
    const agendamentosChartResult = await db.query(agendamentosChartQuery);
    const agendamentoLabels = agendamentosChartResult.rows.map(r => r.mes_ano);
    const agendamentoData = agendamentosChartResult.rows.map(r => parseInt(r.total, 10));

    const faturamentoChartQuery = `
      SELECT
          TO_CHAR(data, 'YYYY-MM') AS mes_ano,
          SUM(preco) AS total
      FROM historico_servicos
      WHERE data >= (CURRENT_DATE - INTERVAL '5 months')
      GROUP BY mes_ano
      ORDER BY mes_ano ASC
      LIMIT 6;
    `;
    const faturamentoChartResult = await db.query(faturamentoChartQuery);
    const faturamentoLabels = faturamentoChartResult.rows.map(r => r.mes_ano);
    const faturamentoData = faturamentoChartResult.rows.map(r => parseFloat(r.total || 0));

    res.status(200).json({
      faturamentoMes,
      servicosMaisProcurados,
      novosClientesMes,
      agendamentosChart: {
        labels: agendamentoLabels,
        data: agendamentoData
      },
      faturamentoChart: {
        labels: faturamentoLabels,
        data: faturamentoData
      }
    });

  } catch (err) {
    console.error('Erro ao buscar dados do dashboard:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};


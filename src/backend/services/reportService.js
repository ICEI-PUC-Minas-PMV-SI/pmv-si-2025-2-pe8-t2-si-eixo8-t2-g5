const db = require('../config/db.js');

const fetchBillingData = async ({ startDate, endDate, serviceId }) => {
  try {

    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);

   
    let query = `
  SELECT 
    a.id,
    a.data_hora AS date, 
    a.nome_cliente AS "clientName", 
    s.name AS "serviceName", 
    
    
    s.min_price AS value, 
    
    a.status,
    a.pagamento AS "paymentStatus" -- Mapeia a coluna de pagamento para um nome descritivo
  FROM 
    agendamentos AS a
  LEFT JOIN 
    services AS s ON a.servico::int = s.id 
  WHERE 
    a.status = 'Concluído' AND 
    a.data_hora >= $1 AND 
    a.data_hora < $2
`;
    
    const params = [startDate, adjustedEndDate.toISOString().split('T')[0]];

    if (serviceId !== '0') {
    
      query += ' AND a.servico::int = $3'; 
      params.push(serviceId);
    }

    query += ' ORDER BY a.data_hora DESC;';

   
    const { rows: details } = await db.query(query, params); 
    
   
    let totalBilling = 0;
    details.forEach(app => {
      totalBilling += parseFloat(app.value) || 0; 
    });

    const completedAppointments = details.length;
    const averagePerAppointment = completedAppointments > 0 
      ? totalBilling / completedAppointments 
      : 0;

 
    return {
      summary: {
        totalBilling,
        averagePerAppointment,
        completedAppointments,
      },
      details,
    };
    
  } catch (error) {
    console.error('Erro detalhado ao buscar relatório:', error);
    throw new Error(`Erro ao buscar dados de faturamento: ${error.message}`);
  }
};

module.exports = {
  fetchBillingData
};
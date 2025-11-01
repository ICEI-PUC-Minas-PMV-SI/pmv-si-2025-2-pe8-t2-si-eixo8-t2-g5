const db = require('../config/db.js');

const fetchBillingData = async ({ startDate, endDate, serviceId }) => {
  try {

    const result = await db.query(
      `SELECT * FROM billing 
       WHERE service_id = ? 
       AND date BETWEEN ? AND ?`,
      [serviceId, startDate, endDate]
    );
    
    return result;
  } catch (error) {
    throw new Error(`Erro ao buscar dados de faturamento: ${error.message}`);
  }
};

module.exports = {
  fetchBillingData
};
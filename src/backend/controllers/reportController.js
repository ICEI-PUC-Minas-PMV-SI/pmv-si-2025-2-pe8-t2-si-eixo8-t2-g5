const reportService = require('../services/reportService.js');

const getBillingReport = async (req, res) => {
  try {
    const { startDate, endDate, serviceId } = req.query;

    if (!startDate || !endDate || !serviceId) {
      return res.status(400).json({ 
        message: 'Parâmetros ausentes. É necessário startDate, endDate e serviceId.' 
      });
    }

    const reportData = await reportService.fetchBillingData({
      startDate,
      endDate,
      serviceId,
    });

    return res.status(200).json(reportData);

  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    return res.status(500).json({ 
      message: 'Erro interno do servidor ao gerar relatório.',
      error: error.message 
    });
  }
};

module.exports = {
  getBillingReport,
};
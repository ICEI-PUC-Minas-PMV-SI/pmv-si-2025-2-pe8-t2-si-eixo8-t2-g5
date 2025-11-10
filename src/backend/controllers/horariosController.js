const horariosService = require('../services/horariosService');

const getHorariosConfig = async (req, res) => {
  try {
    const config = await horariosService.fetchHorariosConfig();
    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar configurações.', error: error.message });
  }
};

const updateHorariosConfig = async (req, res) => {
  try {
    const { periodo, inicio, fim } = req.body; 

    if (!periodo || !inicio || !fim) {
      return res.status(400).json({ message: 'Dados incompletos para atualização.' });
    }

    const updatedConfig = await horariosService.saveHorariosConfig(periodo, inicio, fim);
    res.status(200).json(updatedConfig);

  } catch (error) {
    res.status(500).json({ message: 'Erro ao salvar configuração.', error: error.message });
  }
};

module.exports = {
  getHorariosConfig,
  updateHorariosConfig,
};
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();


app.use(cors()); 
app.use(express.json()); 

const authRoutes = require('./routes/authRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const historicoRoutes = require('./routes/historicoRoutes');
const agendamentoRoutes = require('./routes/agendamentoRoutes');
const adminRoutes = require('./routes/adminRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reportRoutes = require('./routes/reportRoutes'); 
const registerRoutes = require('./routes/registerRoutes');
const desempenhoRoutes = require('./routes/desempenhoRoutes');
const horariosRoutes = require('./routes/horariosRoutes');


app.use('/api', authRoutes); 
app.use('/api/services', servicesRoutes); 
app.use('/api/historico', historicoRoutes); 
app.use('/api/agendamento', agendamentoRoutes); 
app.use('/api/admin', adminRoutes); 
app.use('/api/clientes', clienteRoutes); 
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes); 
app.use('/api', registerRoutes);
app.use('/api/horarios', horariosRoutes);
app.use('/api/admin/desempenho', desempenhoRoutes);

const PORT = process.env.PORT || 7208;
app.listen(PORT, () => {
  console.log(` Servidor rodando na porta ${PORT}`);
});
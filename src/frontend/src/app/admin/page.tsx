'use client';

import styles from './page.module.scss';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { FormEvent, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import dayjs, { Dayjs } from 'dayjs';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

interface ReportData {
  summary: {
    totalBilling: number;
    averagePerAppointment: number;
    completedAppointments: number;
  };
  details: {
    id: string;
    date: string;
    clientName: string;
    serviceName: string;
    value: number;
    status: string;
  }[];
}

interface Servico {
  id: number;
  name: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};


export default function RelatoriosAdminPage() {
  const [tab, setTab] = useState('1');
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(30, 'day'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [service, setService] = useState('0');

  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [servicesList, setServicesList] = useState<Servico[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        setError("Não foi possível carregar a lista de serviços: Usuário não autenticado.");
        return;
      }

      try {
        const res = await fetch('http://localhost:7208/api/services', {
           headers: {
             'Authorization': `Bearer ${authToken}`
           }
        });
        
        if (!res.ok) {
          throw new Error('Falha ao carregar lista de serviços.');
        }
        const data = await res.json();
        setServicesList(data);
      } catch (err: any) {
        console.error("Erro ao buscar serviços:", err.message);
        setError("Não foi possível carregar a lista de serviços.");
      }
    };
    fetchServices();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setService(event.target.value as string);
  };

  const generateReport = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setReportData(null); 

    if (!startDate || !endDate) {
      setError('Por favor, selecione data inicial e final.');
      setIsLoading(false);
      return;
    }

    const sDate = startDate.format('YYYY-MM-DD');
    const eDate = endDate.format('YYYY-MM-DD');
    
    const authToken = localStorage.getItem('token'); 
    
    if (!authToken) {
       setError('Sessão expirada ou usuário não autenticado. Faça login novamente.');
       setIsLoading(false);
       return;
    }

    try {
      const response = await fetch(
        `http://localhost:7208/api/reports/billing?startDate=${sDate}&endDate=${eDate}&serviceId=${service}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        let errorText = `Falha ao buscar o relatório. Status: ${response.status}`;
        try {
          const errorData = await response.json();
          
          if (response.status === 401 || response.status === 403) {
             errorText = 'Erro de Autenticação. Por favor, faça login novamente.';
          } else {
             errorText = errorData.message || errorData.erro || errorText;
          }
        } catch (jsonError) {}
        throw new Error(errorText);
      }

      const data: ReportData = await response.json();
      setReportData(data);
      
      if (data.details.length === 0) {
        setError('Nenhum resultado encontrado para os filtros selecionados.');
      }

    } catch (err: any) {
      if (err.message.includes('Unexpected token')) {
        setError('Erro de rede: Não foi possível conectar à API.');
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.relatorios}>
      <h2>Relatórios</h2>
      <p>Gere relatórios detalhados sobre o desempenho do seu salão.</p>
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleTabChange} aria-label="lab API tabs example">
            <Tab label="Faturamento" value="1" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <form onSubmit={generateReport}>
            <h3>Filtros</h3>
            <div className={styles.form_field}>
              <label>Data inicial</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker value={startDate} onChange={(newValue) => setStartDate(newValue)} />
              </LocalizationProvider>
            </div>
            <div className={styles.form_field}>
              <label>Data final</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker value={endDate} onChange={(newValue) => setEndDate(newValue)} />
              </LocalizationProvider>
            </div>

            <div className={styles.form_field}>
              <label>Serviço</label>
              <Select
                value={service}
                label="Serviço"
                onChange={handleChange}
              >
                <MenuItem value="0">Todos os serviços</MenuItem> 
                
                {servicesList.map((s) => (
                  <MenuItem key={s.id} value={String(s.id)}> 
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
            
            <Button className={styles.submit_btn} variant="contained" type='submit' disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Gerar Relatório'}
            </Button>
          </form>
          
          {error && <Alert severity="warning" sx={{ mt: 3, mb: 2 }}>{error}</Alert>}
          
          {isLoading && !reportData && (
             <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                <CircularProgress />
             </Box>
          )}

          {reportData && reportData.details.length > 0 && (
            <div className={styles.result}>
              <h3>Resultados</h3>
              <div className={styles.data_cards_list}>
                <div className={styles.item}>
                  <h4>Faturamento Total</h4>
                  <p>{formatCurrency(reportData.summary.totalBilling)}</p>
                </div>
                <div className={styles.item}>
                  <h4>Média por Agendamento</h4>
                  <p>{formatCurrency(reportData.summary.averagePerAppointment)}</p>
                </div>
                <div className={styles.item}>
                  <h4>Agendamentos Realizados</h4>
                  <p>{reportData.summary.completedAppointments}</p>
                </div>
              </div>
              <TableContainer component={Paper} sx={{ mt: 3, mb: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="tabela de faturamento">
                  <TableHead>
                    <TableRow>
                      <TableCell>Data</TableCell>
                      <TableCell>Cliente</TableCell>
                      <TableCell>Serviço</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.details.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{formatDate(row.date)}</TableCell>
                        <TableCell>{row.clientName}</TableCell>
                        <TableCell>{row.serviceName}</TableCell>
                        <TableCell>{formatCurrency(row.value)}</TableCell>
                        <TableCell>{row.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button variant="contained">Exportar</Button>
            </div>
          )}
        </TabPanel>
      </TabContext>
    </main>
  );
}
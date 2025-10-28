'use client';

import styles from './page.module.scss';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { FormEvent, useState } from 'react';
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

function createData(
  data: string,
  cliente: string,
  servico: string,
  valor: string,
  status: string
) {
  return { data, cliente, servico, valor, status };
}

const rows = [
  createData('01/08/2024', 'Sofia Almeida', 'Corte de Cabelo', 'R$ 80,00', 'Concluído'),
  createData('05/08/2024', 'Lucas Pereira', 'Barba', 'R$ 50,00', 'Concluído'),
  createData('10/08/2024', 'Isabela Costa', 'Manicure', 'R$ 45,00', 'Concluído'),
  createData('15/08/2024', 'Rafael Santos', 'Pedicure', 'R$ 55,00', 'Concluído'),
  createData('20/08/2024', 'Mariana Oliveira', 'Coloração', 'R$ 120,00', 'Concluído'),
];

export default function RelatoriosAdminPage() {
  const [tab, setTab] = useState('1');
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs('2022-04-17'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs('2022-04-17'));
  const [service, setService] = useState('0');

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setService(event.target.value as string);
  };

  const generateReport = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

  return (
    <main className={styles.relatorios}>
      <h2>Relatórios</h2>
      <p>Gere relatórios detalhados sobre o desempenho do seu salão.</p>
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleTabChange} aria-label="lab API tabs example">
            <Tab label="Faturamento" value="1" />
            {/* <Tab label="Inadimplência" value="2" /> */}
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
                <MenuItem value={0} selected>Selecione um serviço</MenuItem>
                <MenuItem value={1}>Corte de Cabelo</MenuItem>
                <MenuItem value={2}>Coloração</MenuItem>
                <MenuItem value={3}>Mechas</MenuItem>
                <MenuItem value={4}>Tratamentos Capilares</MenuItem>
                <MenuItem value={5}>Maquiagem Social</MenuItem>
                <MenuItem value={6}>Maquiagem para Festas</MenuItem>
                <MenuItem value={7}>Maquiagem para Noivas</MenuItem>
                <MenuItem value={8}>Manicure</MenuItem>
                <MenuItem value={9}>Pedicure</MenuItem>
                <MenuItem value={10}>Alongamento de Unhas</MenuItem>
              </Select>
            </div>
            <Button className={styles.submit_btn} variant="contained" type='submit'>Gerar Relatório</Button>
          </form>
          <div className={styles.result}>
            <h3>Resultados</h3>
            <div className={styles.data_cards_list}>
              <div className={styles.item}>
                <h4>Faturamento Total</h4>
                <p>R$ 15.500,00</p>
              </div>
              <div className={styles.item}>
                <h4>Média por Agendamento</h4>
                <p>R$ 155,00</p>
              </div>
              <div className={styles.item}>
                <h4>Agendamentos Realizados</h4>
                <p>100</p>
              </div>
            </div>
            <TableContainer component={Paper}>
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
                  {rows.map((row) => (
                    <TableRow key={row.data}>
                      <TableCell>{row.data}</TableCell>
                      <TableCell>{row.cliente}</TableCell>
                      <TableCell>{row.servico}</TableCell>
                      <TableCell>{row.valor}</TableCell>
                      <TableCell>{row.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button variant="contained">Exportar</Button>
          </div>
        </TabPanel>
        {/* <TabPanel value="2">Item Two</TabPanel> */}
      </TabContext>
    </main>
  );
}
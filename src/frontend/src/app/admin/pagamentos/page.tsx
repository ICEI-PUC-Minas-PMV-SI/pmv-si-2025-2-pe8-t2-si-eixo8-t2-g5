'use client';

import styles from './page.module.scss';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MenuItem from '@mui/material/MenuItem';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Box from '@mui/material/Box';

const payments = [
  {
    cliente: 'Sofia Almeida',
    servico: 'Corte de cabelo e coloração',
    valor: 150,
    dataPagamento: '2024-07-15',
    status: 'Pago',
  },
  {
    cliente: 'Beatriz Costa',
    servico: 'Manicure e pedicure',
    valor: 80,
    dataPagamento: '2024-07-16',
    status: 'Pendente',
  },
  {
    cliente: 'Mariana Silva',
    servico: 'Tratamento facial',
    valor: 120,
    dataPagamento: '2024-07-17',
    status: 'Pago',
  },
  {
    cliente: 'Laura Santos',
    servico: 'Maquiagem para evento',
    valor: 200,
    dataPagamento: '2024-07-18',
    status: 'Pendente',
  },
  {
    cliente: 'Carolina Pereira',
    servico: 'Design de sobrancelhas',
    valor: 50,
    dataPagamento: '2024-07-19',
    status: 'Reembolsado',
  },
];

export default function AdminPagamentosPage() {
  const [search, setSearch] = useState('');
  const [client, setClient] = useState('0');
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [service, setService] = useState('0');
  const [status, setStatus] = useState('0');

  const handleClientChnage = (event: SelectChangeEvent) => {
    setClient(event.target.value as string);
  }

  const handleServiceChange = (event: SelectChangeEvent) => {
    setService(event.target.value as string);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };

  return (
    <main className={styles.pagementos}>
      <h2>Pagamentos</h2>
      <p>Visualize e gerencie todos os pagamentos recebidos pelo salão.</p>
      <TextField
        label='Buscar  pagamentos por nome do cliente ou serviço'
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
        variant="filled"
        className={styles.search_input}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className={styles.filters}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Data"
            value={date}
            onChange={(newValue) => setDate(newValue)}
            sx={{
              bgcolor: '#F7F7F7',
            }}
          />
        </LocalizationProvider>
        <Select
          value={client}
          onChange={handleClientChnage}
          sx={{
            bgcolor: '#F7F7F7',
          }}
        >
          <MenuItem value={0} selected>Cliente</MenuItem>
          <MenuItem value={1}>Sofia Almeida</MenuItem>
          <MenuItem value={2}>Beatriz Costa</MenuItem>
          <MenuItem value={3}>Mariana Silva</MenuItem>
          <MenuItem value={4}>Laura Santos</MenuItem>
          <MenuItem value={5}>Carolina Pereira</MenuItem>
        </Select>
        <Select
          value={service}
          onChange={handleServiceChange}
          sx={{
            bgcolor: '#F7F7F7',
          }}
        >
          <MenuItem value={0} selected>Serviço</MenuItem>
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
        <Select
          value={status}
          onChange={handleStatusChange}
          sx={{
            bgcolor: '#F7F7F7',
          }}
        >
          <MenuItem value={0} selected>Status</MenuItem>
          <MenuItem value={1}>Pendente</MenuItem>
          <MenuItem value={2}>Confirmado</MenuItem>
          <MenuItem value={3}>Concluído</MenuItem>
        </Select>
      </div>
      <TableContainer component={Paper} sx={{ borderRadius: '12px' }}>
        <Table sx={{ minWidth: 800 }} aria-label="tabela de pagamentos">
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Serviço</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Data do Pagamento</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.cliente}</TableCell>
                <TableCell sx={{ color: '#a66a7b' }}>{row.servico}</TableCell>
                <TableCell>{`R$ ${row.valor.toFixed(2).replace('.', ',')}`}</TableCell>
                <TableCell>{dayjs(row.dataPagamento).format('DD/MM/YYYY')}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      backgroundColor: '#f8eef0',
                      borderRadius: '16px',
                      display: 'inline-block',
                      px: 2,
                      py: 0.5,
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      color:
                        row.status === 'Pago'
                          ? '#4caf50'
                          : row.status === 'Reembolsado'
                            ? '#6a1b9a'
                            : '#a66a7b',
                    }}
                  >
                    {row.status}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </main>
  );
}

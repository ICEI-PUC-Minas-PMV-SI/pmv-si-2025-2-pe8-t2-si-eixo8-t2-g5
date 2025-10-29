'use client';

import styles from './page.module.scss';
import OutlinedInput from '@mui/material/OutlinedInput';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

function createData(
  cliente: string,
  servico: string,
  data: string,
  hora: string,
  status: string,
  pagamento: string
) {
  return { cliente, servico, data, hora, status, pagamento };
}

const rows = [
  createData('Sofia Almeida', 'Corte de cabelo e coloração', '15/07/2024', '14:00', 'Confirmado', 'Pago'),
  createData('Beatriz Costa', 'Manicure e pedicure', '16/07/2024', '10:00', 'Pendente', 'Pendente'),
  createData('Mariana Silva', 'Tratamento facial', '17/07/2024', '16:00', 'Concluído', 'Pago'),
  createData('Laura Santos', 'Maquiagem para evento', '18/07/2024', '18:00', 'Confirmado', 'Pendente'),
  createData('Carolina Pereira', 'Design de sobrancelhas', '19/07/2024', '11:00', 'Cancelado', 'Pago'),
];

export default function AdminAgendamentoPage() {
  const [search, setSearch] = useState('');
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [service, setService] = useState('0');
  const [status, setStatus] = useState('0');

  const handleSearch = (newValue: string) => {
    setSearch(newValue);
  }

  const handleServiceChange = (event: SelectChangeEvent) => {
    setService(event.target.value as string);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };

  return (
    <main className={styles.admin_agendamentos}>
      <h2>Agendamentos</h2>
      <p>Visualize e gerencie todos os agendamentos do salão.</p>
      <OutlinedInput
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        startAdornment={
          <InputAdornment position="start">
            <IconButton edge="start">
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        }
        placeholder='Buscar agendamentos por nome do cliente ou serviço'
        className={styles.search_input}
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
          value={service}
          onChange={handleServiceChange}
          sx={{
            bgcolor: '#F7F7F7',
          }}
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
        <Select
          value={status}
          onChange={handleStatusChange}
          sx={{
            bgcolor: '#F7F7F7',
          }}
        >
          <MenuItem value={0} selected>Selecione um status</MenuItem>
          <MenuItem value={1}>Pendente</MenuItem>
          <MenuItem value={2}>Confirmado</MenuItem>
          <MenuItem value={3}>Concluído</MenuItem>
        </Select>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 750 }}>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Serviço</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Hora</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Pagamento</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.cliente}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{row.cliente}</TableCell>
                <TableCell sx={{ color: '#a66a7b' }}>{row.servico}</TableCell>
                <TableCell>{row.data}</TableCell>
                <TableCell>{row.hora}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      backgroundColor: '#f8eef0',
                      borderRadius: '16px',
                      display: 'inline-block',
                      px: 2,
                      py: 0.5,
                      color:
                        row.status === 'Concluído'
                          ? '#4caf50'
                          : row.status === 'Cancelado'
                            ? '#e57373'
                            : '#a66a7b',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                    }}
                  >
                    {row.status}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      backgroundColor: '#f8eef0',
                      borderRadius: '16px',
                      display: 'inline-block',
                      px: 2,
                      py: 0.5,
                      color:
                        row.pagamento === 'Pago'
                          ? '#4caf50'
                          : '#a66a7b',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                    }}
                  >
                    {row.pagamento}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="text"
                      sx={{
                        color: '#a66a7b',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                      }}
                      onClick={() => console.log(`Editar ${row.cliente}`)}
                    >
                      Editar
                    </Button>
                    <span style={{ color: '#a66a7b' }}>|</span>
                    <Button
                      variant="text"
                      sx={{
                        color: '#a66a7b',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                      }}
                      onClick={() => console.log(`Cancelar ${row.cliente}`)}
                    >
                      Cancelar
                    </Button>
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

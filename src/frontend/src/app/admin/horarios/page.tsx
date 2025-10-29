'use client';

import styles from './page.module.scss';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Button from '@mui/material/Button';
import EditDialog from './components/EditDialog';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Box from '@mui/material/Box';

const generateTimeSlots = (startHour: number, endHour: number) => {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    const start = dayjs().hour(hour).minute(0).format('HH:mm');
    const end = dayjs().hour(hour + 1).minute(0).format('HH:mm');
    slots.push(`${start} - ${end}`);
  }
  return slots;
};

const timeSlots = generateTimeSlots(9, 18);

const rows = [
  ['Disponível', 'Ocupado', 'Disponível', 'Ocupado', 'Disponível', 'Ocupado'],
  ['Ocupado', 'Disponível', 'Ocupado', 'Disponível', 'Ocupado', 'Disponível'],
  ['Disponível', 'Ocupado', 'Disponível', 'Ocupado', 'Disponível', 'Ocupado'],
  ['Ocupado', 'Disponível', 'Ocupado', 'Disponível', 'Ocupado', 'Disponível'],
  ['Disponível', 'Ocupado', 'Disponível', 'Ocupado', 'Disponível', 'Ocupado'],
  ['Ocupado', 'Disponível', 'Ocupado', 'Disponível', 'Ocupado', 'Disponível'],
  ['Disponível', 'Ocupado', 'Disponível', 'Ocupado', 'Disponível', 'Ocupado'],
  ['Ocupado', 'Disponível', 'Ocupado', 'Disponível', 'Ocupado', 'Disponível'],
  ['Disponível', 'Ocupado', 'Disponível', 'Ocupado', 'Disponível', 'Ocupado'],
];

export default function AdminHorariosPage() {
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [morningStartTime, setMorningStartTime] = useState<Dayjs>(dayjs().hour(8).minute(0));
  const [morningEndTime, setMorningEndTime] = useState<Dayjs>(dayjs().hour(12).minute(0));
  const [afternoonStartTime, setAfternoonStartTime] = useState<Dayjs>(dayjs().hour(13).minute(0));
  const [afternoonEndTime, setAfternoonEndTime] = useState<Dayjs>(dayjs().hour(18).minute(0));
  const [nightStartTime, setNightStartTime] = useState<Dayjs>(dayjs().hour(19).minute(0));
  const [nightEndTime, setNightEndTime] = useState<Dayjs>(dayjs().hour(22).minute(0));
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState<'morning' | 'afternoon' | 'night'>('morning');
  const [search, setSearch] = useState('');
  const [service, setService] = useState('0');
  const [status, setStatus] = useState('0');

  const openTimeDialog = (type: 'morning' | 'afternoon' | 'night') => {
    setCurrentPeriod(type);
    setOpenEditDialog(true);
  };

  const handleClose = () => {
    setOpenEditDialog(false);
  };

  const handleTimeChange = (startTime: Dayjs, endTime: Dayjs) => {
    switch (currentPeriod) {
      case 'morning':
        setMorningStartTime(startTime);
        setMorningEndTime(endTime);
        break;
      case 'afternoon':
        setAfternoonStartTime(startTime);
        setAfternoonEndTime(endTime);
        break;
      case 'night':
        setNightStartTime(startTime);
        setNightEndTime(endTime);
        break;
    }
  };

  const getCurrentTimes = () => {
    switch (currentPeriod) {
      case 'morning':
        return { start: morningStartTime, end: morningEndTime };
      case 'afternoon':
        return { start: afternoonStartTime, end: afternoonEndTime };
      case 'night':
        return { start: nightStartTime, end: nightEndTime };
    }
  };

  const times = getCurrentTimes();

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
    <main className={styles.admin_horarios}>
      <h2>Gerenciar Horários</h2>
      <p>Defina e gerencie os horários livres na agenda do salão.</p>
      <div className={styles.time_config}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={date}
            onChange={(newValue) => setDate(newValue)}
            sx={{
              margin: 0
            }}
          />
        </LocalizationProvider>
        <div className={styles.available_dates}>
          <h3>Horários Disponíveis</h3>
          <div className={styles.available_dates_list}>
            <div className={styles.available_dates_item}>
              <div className={styles.available_dates_item_info}>
                <h4>Manhã</h4>
                <p>{morningStartTime.format('HH:mm')} - {morningEndTime.format('HH:mm')}</p>
              </div>
              <Button onClick={() => openTimeDialog('morning')} variant="contained">Editar</Button>
            </div>
            <div className={styles.available_dates_item}>
              <div className={styles.available_dates_item_info}>
                <h4>Tarde</h4>
                <p>{afternoonStartTime.format('HH:mm')} - {afternoonEndTime.format('HH:mm')}</p>
              </div>
              <Button onClick={() => openTimeDialog('afternoon')} variant="contained">Editar</Button>
            </div>
            <div className={styles.available_dates_item}>
              <div className={styles.available_dates_item_info}>
                <h4>Noite</h4>
                <p>{nightStartTime.format('HH:mm')} - {nightEndTime.format('HH:mm')}</p>
              </div>
              <Button onClick={() => openTimeDialog('night')} variant="contained">Editar</Button>
            </div>
          </div>
          <EditDialog
            open={openEditDialog}
            startTime={times.start}
            endTime={times.end}
            onTimeChange={handleTimeChange}
            onClose={handleClose}
          />
        </div>
      </div>
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
        placeholder='Buscar  horários por data ou serviço'
        className={styles.search_input}
      />
      <div className={styles.filters}>
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
      <TableContainer component={Paper} sx={{ borderRadius: '12px' }}>
        <Table sx={{ minWidth: 800 }} aria-label="tabela de horários">
          <TableHead>
            <TableRow>
              <TableCell>Horário</TableCell>
              <TableCell>Segunda-feira</TableCell>
              <TableCell>Terça-feira</TableCell>
              <TableCell>Quarta-feira</TableCell>
              <TableCell>Quinta-feira</TableCell>
              <TableCell>Sexta-feira</TableCell>
              <TableCell>Sábado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timeSlots.map((slot, index) => (
              <TableRow key={slot}>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: '#a66a7b',
                    width: '140px',
                  }}
                >
                  {slot}
                </TableCell>

                {/* Status cells */}
                {rows[index].map((status, i) => (
                  <TableCell key={i}>
                    <Box
                      sx={{
                        backgroundColor: '#f8eef0',
                        borderRadius: '16px',
                        display: 'inline-block',
                        px: 2,
                        py: 0.5,
                        color: status === 'Disponível' ? '#4caf50' : '#a66a7b',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        textAlign: 'center',
                      }}
                    >
                      {status}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </main>
  );
}
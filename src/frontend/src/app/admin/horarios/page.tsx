'use client';

import styles from './page.module.scss';
import { useState, useEffect, FormEvent } from 'react'; 
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.locale('pt-br');
dayjs.extend(customParseFormat);

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
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';

const API_BASE_URL = 'http://localhost:7208/api';

interface AgendaCellData {
  status: 'Disponível' | 'Ocupado' | 'Bloqueado';
  appId?: number;
  cliente?: string;
  servico?: string;
  statusApp?: string;
}

interface AgendaData {
  timeSlots: string[];
  grid: AgendaCellData[][];
}

function AgendaCell({ data }: { data: AgendaCellData }) {
  let backgroundColor = '#f8eef0';
  let color = '#a66a7b';
  let text = 'Bloqueado';

  if (data.status === 'Disponível') {
    backgroundColor = '#e8f5e9';
    color = '#4caf50';
    text = 'Disponível';
  } else if (data.status === 'Ocupado') {
    backgroundColor = '#fce4ec';
    color = '#c51162';
    text = 'Ocupado';
  }

  const cellContent = (
    <Box
      sx={{
        backgroundColor,
        color,
        borderRadius: '16px',
        display: 'inline-block',
        px: 2,
        py: 0.5,
        fontWeight: 500,
        fontSize: '0.875rem',
        textAlign: 'center',
        cursor: data.appId ? 'pointer' : 'default',
      }}
    >
      {text}
    </Box>
  );

  if (data.status === 'Ocupado') {
    return (
      <Tooltip title={
        <div>
          <p><strong>Cliente:</strong> {data.cliente}</p>
          <p><strong>Serviço:</strong> {data.servico}</p>
          <p><strong>Status:</strong> {data.statusApp}</p>
        </div>
      }>
        {cellContent}
      </Tooltip>
    )
  }

  return cellContent;
}


export default function AdminHorariosPage() {
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  
  const [morningStartTime, setMorningStartTime] = useState<Dayjs>(dayjs().hour(8).minute(0));
  const [morningEndTime, setMorningEndTime] = useState<Dayjs>(dayjs().hour(12).minute(0));
  const [afternoonStartTime, setAfternoonStartTime] = useState<Dayjs>(dayjs().hour(13).minute(0));
  const [afternoonEndTime, setAfternoonEndTime] = useState<Dayjs>(dayjs().hour(18).minute(0));
  const [nightStartTime, setNightStartTime] = useState<Dayjs>(dayjs().hour(19).minute(0));
  const [nightEndTime, setNightEndTime] = useState<Dayjs>(dayjs().hour(22).minute(0));
  
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState<'manha' | 'tarde' | 'noite'>('manha');
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);
  const [errorConfig, setErrorConfig] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [service, setService] = useState('0');
  const [status, setStatus] = useState('0');

  const [agendaData, setAgendaData] = useState<AgendaData | null>(null);
  const [isLoadingAgenda, setIsLoadingAgenda] = useState(false);
  const [errorAgenda, setErrorAgenda] = useState<string | null>(null);
  
  const getToken = () => {
    if (typeof window !== 'undefined') return localStorage.getItem('token');
    return null;
  };
  
  useEffect(() => {
    const fetchHorariosConfig = async () => {
      setIsLoadingConfig(true);
      setErrorConfig(null);
      try {
        const response = await fetch(`${API_BASE_URL}/horarios/config`);
        if (!response.ok) {
          throw new Error('Falha ao carregar horários de trabalho.');
        }
        const data = await response.json();
        
        setMorningStartTime(dayjs(data.manha.inicio, 'HH:mm'));
        setMorningEndTime(dayjs(data.manha.fim, 'HH:mm'));
        setAfternoonStartTime(dayjs(data.tarde.inicio, 'HH:mm'));
        setAfternoonEndTime(dayjs(data.tarde.fim, 'HH:mm'));
        setNightStartTime(dayjs(data.noite.inicio, 'HH:mm'));
        setNightEndTime(dayjs(data.noite.fim, 'HH:mm'));

      } catch (err: any) {
        setErrorConfig(err.message);
      } finally {
        setIsLoadingConfig(false);
      }
    };
    
    fetchHorariosConfig();
  }, []);

  useEffect(() => {
    const fetchAgenda = async () => {
      if (!date) return;

      setIsLoadingAgenda(true);
      setErrorAgenda(null);
      setAgendaData(null);
      
      const token = getToken();
      
      try {
        const params = new URLSearchParams();
        params.append('date', date.format('YYYY-MM-DD'));
        params.append('serviceId', service);
        params.append('status', status);
        params.append('search', search);

        const response = await fetch(`${API_BASE_URL}/admin/agenda-semana?${params.toString()}`,  {
          headers: { 'Authorization': `Bearer ${token}` }
        }); 
        if (!response.ok) {
          throw new Error('Falha ao carregar a agenda da semana.');
        }

        const data: AgendaData = await response.json();
        setAgendaData(data);
        if (data.grid.length === 0) {
          setErrorAgenda('Nenhum horário de trabalho configurado para esta semana.');
        }

      } catch (err: any) {
        setErrorAgenda(err.message);
      } finally {
        setIsLoadingAgenda(false);
      }
    };

    fetchAgenda();
  }, [date, service, status, search]);


  const openTimeDialog = (type: 'manha' | 'tarde' | 'noite') => {
    setCurrentPeriod(type);
    setOpenEditDialog(true);
  };

  const handleClose = () => {
    setOpenEditDialog(false);
  };

  const handleTimeChange = async (startTime: Dayjs, endTime: Dayjs) => {
    setIsLoadingConfig(true);
    setErrorConfig(null);
    
    const token = getToken();

    try {
      const response = await fetch(`${API_BASE_URL}/admin/horarios-config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          periodo: currentPeriod,
          inicio: startTime.format('HH:mm'),
          fim: endTime.format('HH:mm'),
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar horário.');
      }
      
      switch (currentPeriod) {
        case 'manha':
          setMorningStartTime(startTime);
          setMorningEndTime(endTime);
          break;
        case 'tarde':
          setAfternoonStartTime(startTime);
          setAfternoonEndTime(endTime);
          break;
        case 'noite':
          setNightStartTime(startTime);
          setNightEndTime(endTime);
          break;
      }
      handleClose();

    } catch (err: any) {
      setErrorConfig(err.message);
    } finally {
      setIsLoadingConfig(false);
    }
  };

  const getCurrentTimes = () => {
    switch (currentPeriod) {
      case 'manha':
        return { start: morningStartTime, end: morningEndTime };
      case 'tarde':
        return { start: afternoonStartTime, end: afternoonEndTime };
      case 'noite':
        return { start: nightStartTime, end: nightEndTime };
    }
  };

  const times = getCurrentTimes();

  const handleSearch = (newValue: string) => {
    setSearch(newValue);
  };

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
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
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
          {isLoadingConfig && <CircularProgress size={24} />}
          {errorConfig && <Alert severity="error">{errorConfig}</Alert>}
          <div className={styles.available_dates_list}>
            <div className={styles.available_dates_item}>
              <div className={styles.available_dates_item_info}>
                <h4>Manhã</h4>
                <p>{morningStartTime.format('HH:mm')} - {morningEndTime.format('HH:mm')}</p>
              </div>
              <Button onClick={() => openTimeDialog('manha')} variant="contained">Editar</Button>
            </div>
            <div className={styles.available_dates_item}>
              <div className={styles.available_dates_item_info}>
                <h4>Tarde</h4>
                <p>{afternoonStartTime.format('HH:mm')} - {afternoonEndTime.format('HH:mm')}</p>
              </div>
              <Button onClick={() => openTimeDialog('tarde')} variant="contained">Editar</Button>
            </div>
            <div className={styles.available_dates_item}>
              <div className={styles.available_dates_item_info}>
                <h4>Noite</h4>
                <p>{nightStartTime.format('HH:mm')} - {nightEndTime.format('HH:mm')}</p>
              </div>
              <Button onClick={() => openTimeDialog('noite')} variant="contained">Editar</Button>
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
        placeholder='Buscar horários por nome do cliente'
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
          <MenuItem value="0">Todos os serviços</MenuItem>
          <MenuItem value="1">Corte de Cabelo</MenuItem>
          <MenuItem value="10">Alongamento de Unhas</MenuItem>
        </Select>
        <Select
          value={status}
          onChange={handleStatusChange}
          sx={{
            bgcolor: '#F7F7F7',
          }}
        >
          <MenuItem value="0">Todos os status</MenuItem>
          <MenuItem value="1">Pendente</MenuItem>
          <MenuItem value="2">Confirmado</MenuItem>
          <MenuItem value="3">Concluído</MenuItem>
        </Select>
      </div>

      {isLoadingAgenda && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      )}
      {errorAgenda && (
        <Alert severity="warning" sx={{ mt: 2 }}>{errorAgenda}</Alert>
      )}
      
      {agendaData && agendaData.grid.length > 0 && (
        <TableContainer component={Paper} sx={{ borderRadius: '12px', mt: 3 }}>
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
              {agendaData.timeSlots.map((slot, slotIndex) => (
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

                  {agendaData.grid[slotIndex].map((cellData, dayIndex) => (
                    <TableCell key={dayIndex}>
                      <AgendaCell data={cellData} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </main>
  );
}
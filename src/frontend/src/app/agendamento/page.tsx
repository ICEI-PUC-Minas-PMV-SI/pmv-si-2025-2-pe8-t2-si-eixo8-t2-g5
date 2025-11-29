'use client';

import styles from './page.module.scss';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { FormEvent, useState, useEffect, useCallback } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Button from '@mui/material/Button';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Alert from '@mui/material/Alert'; 
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const API_BASE_URL = 'http://localhost:7208/api'; 

interface Service {
  id: number;
  name: string;
  duration_minutes: number;
}

export default function AgendamentoPage() {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState(''); 
  const [serviceId, setServiceId] = useState('0'); 
  const [selectedTime, setSelectedTime] = useState('0'); 
  const [date, setDate] = useState<Dayjs | null>(dayjs()); 

  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]); 

  const [loading, setLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleServiceChange = (event: SelectChangeEvent) => {
    setServiceId(event.target.value as string);
    setSelectedTime('0'); 
  };

  const handleTimeChange = (event: SelectChangeEvent) => {
    setSelectedTime(event.target.value as string);
  };

  useEffect(() => {
    const fetchServices = async () => {
      setLoadingServices(true);
      try {
        const response = await fetch(`${API_BASE_URL}/services`);
        if (!response.ok) throw new Error('Falha ao carregar lista de serviços.');
        const data = await response.json();
        setServicesList(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError('Erro ao carregar serviços: ' + err.message);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  const fetchAvailableTimes = useCallback(async () => {
    if (serviceId === '0' || !date) {
      setAvailableTimes([]);
      return;
    }
    
    setLoadingTimes(true);
    setAvailableTimes([]);

    try {
      const formattedDate = date.format('YYYY-MM-DD');
      const url = `${API_BASE_URL}/agendamento/horarios?date=${formattedDate}&serviceId=${serviceId}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Falha ao buscar horários.');
      const times: string[] = await response.json();
      setAvailableTimes(times);
    } catch {
      setError('Não foi possível carregar os horários disponíveis.');
    } finally {
      setLoadingTimes(false);
    }
  }, [date, serviceId]);

  useEffect(() => {
    fetchAvailableTimes();
  }, [fetchAvailableTimes]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (serviceId === '0' || selectedTime === '0' || !name || !whatsapp || !date) {
      setError('Por favor, preencha todos os campos e selecione um serviço e horário.');
      setLoading(false);
      return;
    }

    const combinedDateTime = date.format('YYYY-MM-DD') + ' ' + selectedTime + ':00'; 

    const postData = {
      nome_cliente: name,
      whatsapp: whatsapp,
      servico_id: serviceId, 
      data_hora: combinedDateTime
    };

    try {
      const response = await fetch(`${API_BASE_URL}/agendamento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Erro ao agendar.');

      setSuccess(data.message);
      setName('');
      setWhatsapp('');
      setServiceId('0');
      setSelectedTime('0');
      setDate(dayjs());
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.agendamento}>
      <div className={styles.block}>
        <h2>Agende seu horário</h2>
        <p>Agende sua visita conosco em poucos passos simples.</p>
        
        <form onSubmit={handleSubmit}>
          
          {error && <Alert severity="error" style={{ marginBottom: 16 }}>{error}</Alert>}
          {success && <Alert severity="success" style={{ marginBottom: 16 }}>{success}</Alert>}

          <div className={styles.form_field}>
            <label>Nome Completo</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Digite seu nome completo'
              disabled={loading}
            />
          </div>

          <div className={styles.form_field}>
            <label>WhatsApp</label>
            <input
              placeholder='(XX) XXXXX-XXXX'
              type='tel' 
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className={styles.form_field}>
            <label>Serviço</label>
            <Select
              value={serviceId}
              onChange={handleServiceChange}
              disabled={loading || loadingServices}
              sx={{
                bgcolor: '#F7F7F7',
                borderRadius: '16px',
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: '16px'
                }
              }}
            >
              <MenuItem value="0" disabled>
                {loadingServices ? 
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={20} sx={{ mr: 1 }} /> Carregando serviços...
                  </Box>
                : 'Selecione um serviço'}
              </MenuItem>

              {servicesList.map(s => (
                <MenuItem key={s.id} value={String(s.id)}>
                  {s.name} ({s.duration_minutes} min)
                </MenuItem>
              ))}
            </Select>
          </div>
          
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar 
              value={date} 
              onChange={(newValue) => setDate(newValue)} 
              disabled={loading}
              disablePast 
            />
          </LocalizationProvider>
          
          <div className={styles.form_field}>
            <label>Horário</label>
            <Select
              value={selectedTime}
              onChange={handleTimeChange}
              disabled={loading || serviceId === '0' || loadingTimes || availableTimes.length === 0}
              sx={{
                bgcolor: '#F7F7F7',
                borderRadius: '16px',
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: '16px'
                }
              }}
            >
              <MenuItem value="0" disabled>
                {serviceId === '0' 
                  ? 'Selecione o serviço e a data'
                  : loadingTimes
                    ? 'Verificando horários...'
                    : availableTimes.length === 0 
                      ? 'Nenhum horário disponível'
                      : 'Selecione um horário'}
              </MenuItem>

              {availableTimes.map(time => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
            </Select>

            {loadingTimes && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <CircularProgress size={20} sx={{ mr: 1 }} /> Verificando disponibilidade...
              </Box>
            )}
          </div>
          
          <Button 
            variant="contained" 
            className={styles.submit_button} 
            type="submit" 
            disabled={loading || serviceId === '0' || selectedTime === '0'}
          >
            {loading ? 'Agendando...' : 'Agendar horário'}
          </Button>

          <p>Você receberá uma confirmação por e-mail ou WhatsApp.</p>
        </form>
      </div>
    </main>
  );
}

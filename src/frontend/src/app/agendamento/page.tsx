'use client';

import styles from './page.module.scss';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { FormEvent, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Button from '@mui/material/Button';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Alert from '@mui/material/Alert'; 

export default function AgendamentoPage() {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState(''); 
  const [service, setService] = useState('0'); 
  const [time, setTime] = useState('0'); 
  const [date, setDate] = useState<Dayjs | null>(dayjs()); 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleServiceChange = (event: SelectChangeEvent) => {
    setService(event.target.value as string);
  };

  const handleTimeChange = (event: SelectChangeEvent) => {
    setTime(event.target.value as string);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (service === '0' || time === '0' || !name || !whatsapp || !date) {
      setError('Por favor, preencha todos os campos e selecione um serviço e horário.');
      setLoading(false);
      return;
    }

    const postData = {
      name,
      whatsapp,
      service, 
      date: date.format('YYYY-MM-DD'), 
      time, 
    };

    try {
      const response = await fetch('http://localhost:7208/api/agendamento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao agendar.');
      }

      setSuccess(data.message);
      setName('');
      setWhatsapp('');
      setService('0');
      setTime('0');
      setDate(dayjs());

    } catch (err: any) {
      setError(err.message);
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
              value={service}
              onChange={handleServiceChange}
              disabled={loading}
              sx={{
                bgcolor: '#F7F7F7',
                borderRadius: '16px',
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: '16px',
                },
              }}
            >
              <MenuItem value="0" disabled>Selecione um serviço</MenuItem>
              <MenuItem value={'Cabelo & Estilo'}>Cabelo & Estilo</MenuItem>
              <MenuItem value={'Manicure'}>Manicure</MenuItem>
              <MenuItem value={'Pedicure'}>Pedicure</MenuItem>
              <MenuItem value={'Facial'}>Facial</MenuItem>
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
              value={time}
              onChange={handleTimeChange}
              disabled={loading}
              sx={{
                bgcolor: '#F7F7F7',
                borderRadius: '16px',
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: '16px',
                },
              }}
            >
              <MenuItem value="0" disabled>Selecione um horário</MenuItem>
              <MenuItem value={'09:00'}>09:00</MenuItem>
              <MenuItem value={'10:00'}>10:00</MenuItem>
              <MenuItem value={'11:00'}>11:00</MenuItem>
              <MenuItem value={'14:00'}>14:00</MenuItem>
              <MenuItem value={'15:00'}>15:00</MenuItem>
              <MenuItem value={'16:00'}>16:00</MenuItem>
            </Select>
          </div>
          <Button 
            variant="contained" 
            className={styles.submit_button} 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Agendando...' : 'Agendar horário'}
          </Button>
          <p>Você receberá uma confirmação por e-mail ou WhatsApp.</p>
        </form>
      </div>
    </main>
  );
}
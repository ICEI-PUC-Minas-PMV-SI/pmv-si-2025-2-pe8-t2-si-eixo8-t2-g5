'use client';

import styles from './page.module.scss';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Button from '@mui/material/Button';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

export default function AgendamentoPage() {
  const [name, setName] = useState('');
  const [number, setNumber] = useState(0);
  const [service, setService] = useState('0');
  const [time, setTime] = useState('0');
  const [date, setDate] = useState<Dayjs | null>(dayjs('2022-04-17'));

  const handleServiceChange = (event: SelectChangeEvent) => {
    setService(event.target.value as string);
  };

  const handleTimeChange = (event: SelectChangeEvent) => {
    setTime(event.target.value as string);
  };

  return (
    <main className={styles.agendamento}>
      <div className={styles.block}>
        <h2>Agende seu horário</h2>
        <p>Agende sua visita conosco em poucos passos simples.</p>
        <form>
          <div className={styles.form_field}>
            <label>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Digite seu nome completo'
            />
          </div>
          <div className={styles.form_field}>
            <label>WhatsApp</label>
            <input
              placeholder='Seu número para WhatsApp'
              type='number'
              value={number}
              onChange={(e) => setNumber(Number(e.target.value))}
            />
          </div>
          <div className={styles.form_field}>
            <label>Serviço</label>
            <Select
              value={service}
              onChange={handleServiceChange}
              sx={{
                bgcolor: '#F7F7F7',
                borderRadius: '16px', // or '12px'
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: '16px', // affects the actual visible outline
                },
              }}
            >
              <MenuItem value={0} selected>Selecione um serviço</MenuItem>
              <MenuItem value={1}>Serviço 1</MenuItem>
              <MenuItem value={2}>Serviço 2</MenuItem>
              <MenuItem value={3}>Serviço 3</MenuItem>
            </Select>
          </div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar value={date} onChange={(newValue) => setDate(newValue)} />
          </LocalizationProvider>
          <div className={styles.form_field}>
            <label>Horário</label>
            <Select
              value={time}
              onChange={handleTimeChange}
              sx={{
                bgcolor: '#F7F7F7',
                borderRadius: '16px', // or '12px'
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: '16px', // affects the actual visible outline
                },
              }}
            >
              <MenuItem value={0} selected>Selecione um horário</MenuItem>
              <MenuItem value={'9:00'}>9:00</MenuItem>
              <MenuItem value={'11:00'}>11:00</MenuItem>
              <MenuItem value={'15:30'}>15:30</MenuItem>
            </Select>
          </div>
          <Button variant="contained" className={styles.submit_button}>Agendar horário</Button>
          <p>Você receberá uma confirmação por e-mail ou WhatsApp.</p>
        </form>
      </div>
    </main>
  );
}

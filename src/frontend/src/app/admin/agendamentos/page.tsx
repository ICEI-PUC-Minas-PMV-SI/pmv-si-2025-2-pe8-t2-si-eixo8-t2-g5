'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Select, 
  SelectChangeEvent, 
  MenuItem, 
  Alert, 
  CircularProgress, 
  OutlinedInput, 
  Paper, 
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Button,
  Chip
} from '@mui/material';
import { useRouter } from 'next/navigation';
import type { Dayjs } from 'dayjs';
import styles from './page.module.scss';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

interface Agendamento {
  id: number;
  cliente: string; 
  servico: string;
  data: string;
  hora: string;
  status: 'Pendente' | 'Confirmado' | 'Concluído' | 'Cancelado';
  pagamento: 'Pendente' | 'Pago';
}

interface Servico {
  id: number;
  name: string;
}

const statusColorMap: Record<Agendamento['status'], "warning" | "success" | "info" | "error"> = {
  'Pendente': 'warning',
  'Confirmado': 'info',
  'Concluído': 'success',
  'Cancelado': 'error',
};

const pagamentoColorMap: Record<Agendamento['pagamento'], "warning" | "success"> = {
  'Pendente': 'warning',
  'Pago': 'success',
};

export default function AdminAgendamentoPage() {
  const router = useRouter();
  
  const [search, setSearch] = useState('');
  const [date, setDate] = useState<Dayjs | null>(null);
  const [service, setService] = useState(''); 
  const [status, setStatus] = useState(''); 
  
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [servicesList, setServicesList] = useState<Servico[]>([]);

  const fetchAgendamentos = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (date) params.append('date', date.format('YYYY-MM-DD'));
      if (service) params.append('service', service);
      if (status) params.append('status', status);

      const res = await fetch(`http://localhost:7208/api/admin/agendamentos?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 401) {
        throw new Error('Acesso não autorizado. Faça login novamente.');
      }
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Falha ao carregar agendamentos.');
      }
      
      const data = await res.json();
      setAgendamentos(data.map((item: any) => ({ ...item, cliente: item.nome_cliente })));

    } catch (err: any) {
      setError(err.message);
      if (err.message.includes('autorizado')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [search, date, service, status, router]); 

  useEffect(() => {
    const fetchServices = async () => {
      const token = localStorage.getItem('token');
      if (!token) return; 

      try {
        const res = await fetch('http://localhost:7208/api/services', {
          headers: { 'Authorization': `Bearer ${token}` } 
        });
        if (!res.ok) {
          throw new Error('Falha ao carregar lista de serviços.');
        }
        const data = await res.json();
        setServicesList(data);
      } catch (err: any) {
        setError(err.message); 
      }
    };
    fetchServices();
  }, []); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Acesso não autorizado. Faça login.');
      setLoading(false);
      router.push('/login'); 
      return;
    }

    const handler = setTimeout(() => {
      fetchAgendamentos(token);
    }, 500); 

    return () => clearTimeout(handler);
  }, [fetchAgendamentos, router]);

  const handleUpdate = async (id: number, type: 'status' | 'pagamento', value: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:7208/api/admin/agendamentos/${id}/${type}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ [type]: value }) 
      });

      if (!res.ok) throw new Error(`Falha ao atualizar ${type}`);
      
      setAgendamentos(prev => 
        prev.map(ag => ag.id === id ? { ...ag, [type]: value as any } : ag) 
      );

    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (typeof window !== 'undefined' && !window.confirm('Tem certeza que deseja deletar este agendamento?')) {
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:7208/api/admin/agendamentos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Falha ao deletar agendamento.');

      setAgendamentos(prev => prev.filter(ag => ag.id !== id)); 

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className={styles.admin_agendamentos}>
      <h2>Agendamentos</h2>
      <p>Visualize e gerencie todos os agendamentos do salão.</p>
      <OutlinedInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>}
        placeholder='Buscar por nome do cliente ou serviço'
        className={styles.search_input}
      />
      <div className={styles.filters}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker 
            label="Filtrar por data" 
            value={date} 
            onChange={setDate} 
            sx={{ bgcolor: '#F7F7F7' }}
          />
        </LocalizationProvider>
        <Select 
          value={service} 
          onChange={(e: SelectChangeEvent<string>) => setService(e.target.value)}
          displayEmpty
          sx={{ bgcolor: '#F7F7F7' }}
        >
          <MenuItem value="">Todos os serviços</MenuItem>
          {servicesList.map((s) => (
            <MenuItem key={s.id} value={String(s.id)}>
              {s.name}
            </MenuItem>
          ))}
        </Select>
        <Select 
          value={status} 
          onChange={(e: SelectChangeEvent<string>) => setStatus(e.target.value)}
          displayEmpty
          sx={{ bgcolor: '#F7F7F7' }}
        >
          <MenuItem value="">Todos os status</MenuItem>
          <MenuItem value={'Pendente'}>Pendente</MenuItem>
          <MenuItem value={'Confirmado'}>Confirmado</MenuItem>
          <MenuItem value={'Concluído'}>Concluído</MenuItem>
          <MenuItem value={'Cancelado'}>Cancelado</MenuItem>
        </Select>
      </div>

      {loading && <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      
      {!loading && !error && (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
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
              {agendamentos.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.cliente}</TableCell>
                  <TableCell sx={{ color: '#a66a7b' }}>{row.servico}</TableCell>
                  <TableCell>{row.data}</TableCell>
                  <TableCell>{row.hora}</TableCell>
                  <TableCell>
                    <Select
                      value={row.status}
                      onChange={(e) => handleUpdate(row.id, 'status', e.target.value)}
                      size="small"
                      variant="standard"
                      sx={{ 
                        '.MuiSelect-select': { 
                          paddingTop: '0px', 
                          paddingBottom: '0px',
                          paddingLeft: '0px',
                          display: 'flex',
                          alignItems: 'center'
                        },
                        boxShadow: 'none', 
                        '.MuiOutlinedInput-notchedOutline': { border: 0 },
                        '&.MuiInput-underline:before': { border: 0 },
                        '&.MuiInput-underline:after': { border: 0 },
                      }}
                    >
                      <MenuItem value="Pendente">
                        <Chip label="Pendente" color="warning" size="small" />
                      </MenuItem>
                      <MenuItem value="Confirmado">
                        <Chip label="Confirmado" color="info" size="small" />
                      </MenuItem>
                        <MenuItem value="Concluído">
                        <Chip label="Concluído" color="success" size="small" />
                      </MenuItem>
                      <MenuItem value="Cancelado">
                        <Chip label="Cancelado" color="error" size="small" />
                      </MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                      <Select
                        value={row.pagamento}
                        onChange={(e) => handleUpdate(row.id, 'pagamento', e.target.value)}
                        size="small"
                        variant="standard"
                        sx={{ 
                          '.MuiSelect-select': { 
                            paddingTop: '0px', 
                            paddingBottom: '0px',
                            paddingLeft: '0px',
                            display: 'flex',
                            alignItems: 'center'
                          },
                          boxShadow: 'none', 
                          '.MuiOutlinedInput-notchedOutline': { border: 0 },
                          '&.MuiInput-underline:before': { border: 0 },
                          '&.MuiInput-underline:after': { border: 0 },
                        }}
                      >
                        <MenuItem value="Pendente">
                          <Chip label="Pendente" color="warning" size="small" />
                        </MenuItem>
                        <MenuItem value="Pago">
                          <Chip label="Pago" color="success" size="small" />
                        </MenuItem>
                      </Select>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        size="small" 
                        sx={{ color: '#a66a7b', textTransform: 'none', minWidth: 'auto', padding: '0 4px' }}
                        onClick={() => handleDelete(row.id)}
                      >
                        Excluir
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {agendamentos.length === 0 && (
             <Box sx={{ p: 2, textAlign: 'center' }}>
               Nenhum agendamento encontrado com esses filtros.
             </Box>
          )}
        </TableContainer>
      )}
    </main>
  );
}
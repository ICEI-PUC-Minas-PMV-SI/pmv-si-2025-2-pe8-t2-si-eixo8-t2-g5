'use client';

import Button from '@mui/material/Button';
import styles from './page.module.scss';
import { useState, useEffect, useCallback, FormEvent, Suspense } from 'react';
import {
  Box,
  Tab,
  TextField,
  InputAdornment,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  Modal,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface Cliente {
  id: number;
  nome: string;
  tipo: 'Mensalista' | 'Avulso';
  plano_servicos: number | null;
  total_servicos: number;
}

interface ClienteAPIResponse {
  id: number;
  nome: string;
  tipo: 'Mensalista' | 'Avulso';
  plano_servicos: number | null;
  total_servicos: string;
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  gap: 2
};

function AdminClientesPageContent() {
  const [tab, setTab] = useState('1');
  const [search, setSearch] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [newClient, setNewClient] = useState({
    nome: '',
    email: '',
    senha: '',
    tipo: 'Avulso',
    plano_servicos: ''
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchClientes = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);

      const res = await fetch(`http://localhost:7208/api/clientes?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 401) throw new Error('Acesso não autorizado. Faça login.');
      if (!res.ok) throw new Error('Falha ao buscar clientes.');

      const data: ClienteAPIResponse[] = await res.json();

      setClientes(data.map((c) => ({
        ...c,
        total_servicos: parseInt(c.total_servicos, 10)
      })));

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        if (err.message.includes('autorizado')) router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [search, router]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Acesso não autorizado.');
      setLoading(false);
      router.push('/login');
      return;
    }

    const handler = setTimeout(() => {
      fetchClientes(token);
    }, 500);

    return () => clearTimeout(handler);
  }, [search, fetchClientes, router]);

  useEffect(() => {
    if (searchParams.get('create_new') === 'true') {
      handleOpenModal();
      router.replace(pathname);
    }
  }, [searchParams, router, pathname]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const handleOpenModal = () => setOpenAddModal(true);
  const handleCloseModal = () => {
    setOpenAddModal(false);
    setModalError(null);
    setNewClient({ nome: '', email: '', senha: '', tipo: 'Avulso', plano_servicos: '' });
  };

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent) => {
    const { name, value } = e.target;
    setNewClient(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  const handleSubmitNewClient = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setModalLoading(true);
    setModalError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setModalError('Autenticação perdida. Faça login novamente.');
      setModalLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:7208/api/clientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newClient)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Falha ao criar cliente.');
      }

      handleCloseModal();
      fetchClientes(token);

    } catch (err: unknown) {
      if (err instanceof Error) setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <main className={styles.clientes}>
      <div className={styles.header}>
        <h2>Clientes</h2>
        <Button variant="contained" onClick={handleOpenModal}>Adicionar cliente</Button>
      </div>
      <TextField
        label='Buscar clientes...'
        variant="filled"
        className={styles.search_input}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleTabChange}>
            <Tab label="Todos" value="1" />
          </TabList>
        </Box>
        <TabPanel value="1">
          {loading && <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {!loading && !error && (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="tabela de clientes">
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Serviços Mensais</TableCell>
                    <TableCell>Total de Serviços</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clientes.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{row.nome}</TableCell>
                      <TableCell sx={{ color: row.tipo === 'Mensalista' ? '#a66a7b' : '#a67b6a' }}>
                        {row.tipo}
                      </TableCell>
                      <TableCell>
                        {row.tipo === 'Mensalista' ? row.plano_servicos : '-'}
                      </TableCell>
                      <TableCell>{row.total_servicos}</TableCell>
                      <TableCell>
                        <Button
                          variant="text"
                          sx={{
                            color: '#a66a7b',
                            textTransform: 'none',
                            fontWeight: 600,
                          }}
                          onClick={() => console.log(`Visualizar ${row.nome}`)}
                        >
                          Visualizar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
      </TabContext>

      <Modal
        open={openAddModal}
        onClose={handleCloseModal}
      >
        <Box sx={modalStyle} component="form" onSubmit={handleSubmitNewClient}>
          <Typography variant="h6" component="h2">
            Adicionar Novo Cliente
          </Typography>

          {modalError && <Alert severity="error">{modalError}</Alert>}

          <TextField
            label="Nome Completo"
            name="nome"
            value={newClient.nome}
            onChange={handleModalChange}
            required
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={newClient.email}
            onChange={handleModalChange}
            required
            fullWidth
          />
          <TextField
            label="Senha Temporária"
            name="senha"
            type="password"
            value={newClient.senha}
            onChange={handleModalChange}
            required
            fullWidth
          />
          <FormControl fullWidth required>
            <InputLabel>Tipo de Cliente</InputLabel>
            <Select
              label="Tipo de Cliente"
              name="tipo"
              value={newClient.tipo}
              onChange={handleModalChange}
            >
              <MenuItem value={'Avulso'}>Avulso</MenuItem>
              <MenuItem value={'Mensalista'}>Mensalista</MenuItem>
            </Select>
          </FormControl>

          {newClient.tipo === 'Mensalista' && (
            <TextField
              label="Nº de Serviços/Mês"
              name="plano_servicos"
              type="number"
              value={newClient.plano_servicos}
              onChange={handleModalChange}
              required
              fullWidth
            />
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button onClick={handleCloseModal} disabled={modalLoading}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={modalLoading}>
              {modalLoading ? <CircularProgress size={24} /> : 'Salvar'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </main>
  );
}

function LoadingFallback() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
      <CircularProgress />
    </Box>
  );
}

export default function AdminClientesPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AdminClientesPageContent />
    </Suspense>
  );
}
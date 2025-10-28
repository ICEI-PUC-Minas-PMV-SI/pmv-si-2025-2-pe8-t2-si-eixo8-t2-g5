'use client';

import Button from '@mui/material/Button';
import styles from './page.module.scss';
import { useState } from 'react';
import TabContext from '@mui/lab/TabContext';
import Box from '@mui/material/Box';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';

function createData(
  nome: string,
  tipo: string,
  servicosMensais: string,
  totalServicos: number,
  acoes: string
) {
  return { nome, tipo, servicosMensais, totalServicos, acoes };
}

const rows = [
  createData('Sofia Almeida', 'Mensalista', '4', 20, 'Visualizar'),
  createData('Lucas Pereira', 'Avulso', '-', 5, 'Visualizar'),
  createData('Isabela Costa', 'Mensalista', '6', 12, 'Visualizar'),
  createData('Gabriel Santos', 'Avulso', '-', 2, 'Visualizar'),
  createData('Mariana Oliveira', 'Mensalista', '4', 8, 'Visualizar'),
];

export default function AdminClientesPage() {
  const [tab, setTab] = useState('1');
  const [search, setSearch] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  return (
    <main className={styles.clientes}>
      <div className={styles.header}>
        <h2>Clientes</h2>
        <Button variant="contained">Adicionar cliente</Button>
      </div>
      <TextField
        label='Buscar clientes...'
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
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleTabChange} aria-label="lab API tabs example">
            <Tab label="Todos" value="1" />
            <Tab label="Mensalistas" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
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
                {rows.map((row) => (
                  <TableRow
                    key={row.nome}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{row.nome}</TableCell>
                    <TableCell sx={{ color: row.tipo === 'Mensalista' ? '#a66a7b' : '#a67b6a' }}>
                      {row.tipo}
                    </TableCell>
                    <TableCell>{row.servicosMensais}</TableCell>
                    <TableCell>{row.totalServicos}</TableCell>
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
                        {row.acoes}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        {/* <TabPanel value="2">Item Two</TabPanel> */}
      </TabContext>
    </main>
  );
}

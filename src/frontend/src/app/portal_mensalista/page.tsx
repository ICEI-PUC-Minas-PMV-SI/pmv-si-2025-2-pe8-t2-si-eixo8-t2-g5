"use client";

import { useState, useEffect } from 'react'; 
import styles from './page.module.scss';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DownloadIcon from '@mui/icons-material/Download';

interface HistoricoRow {
  id: number;
  data: string;
  servico: string;
  profissional: string;
  preco: number;
}

export default function PortalMensalista() {
  const [historico, setHistorico] = useState<HistoricoRow[]>([]);
  const [totalMes, setTotalMes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); 
        
        if (!token) {
          setError('Usuário não autenticado.');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/historico/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Falha ao buscar dados.');
        }

        const data = await res.json();
        setHistorico(data.historico);
        setTotalMes(data.totalMes);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  const handleDownloadPDF = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/historico/relatorio-pdf', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Erro ao gerar relatório');

      const blob = await res.blob(); 
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'relatorio-servicos.pdf'; 
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Erro no download:', error);
      alert('Não foi possível baixar o relatório.');
    }
  };
  
  if (loading) return <p>Carregando dados do portal...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <main className={styles.portal_mensalista}>
      <h2>Mensalista Cliente Portal</h2>
      <h3>Acesse seu histórico de serviços e relatórios.</h3>
      <div className={styles.history_and_services}>
        <h4>Histórico de Serviços</h4>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="right">Data</TableCell>
                <TableCell align="right">Serviço</TableCell>
                <TableCell align="right">Profissional</TableCell>
                <TableCell align="right">Preço</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historico.map((row) => (
                <TableRow
                  key={row.id} 
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="right">{row.data}</TableCell>
                  <TableCell align="right">{row.servico}</TableCell>
                  <TableCell align="right">{row.profissional}</TableCell>
                  <TableCell align="right">R$ {row.preco}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className={styles.total_services}>
          <div className={styles.total_services_info}>
            <h5>Total de Serviços esse mês</h5>
            <p>{totalMes}</p>
          </div>
          <CalendarTodayIcon />
        </div>
        <Button variant="contained" onClick={handleDownloadPDF}>
          <DownloadIcon />
          Gerar Relatório (PDF)
        </Button>
      </div>
    </main>
  );
}
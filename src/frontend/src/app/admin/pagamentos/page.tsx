'use client';

import TableContainer from '@mui/material/TableContainer';
import styles from '../desempenho/page.module.scss';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { useState, useEffect, useCallback } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const API_BASE_URL = 'http://localhost:7208/api';

interface ServicePerformance {
  servico: string;
  clientes: number;
  receita: string;
  recorrencia: string;
  popularidade: number; 
}

const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token'); 
  }
  return null;
};


export default function AdminDesempenhoPage() {
  const [data, setData] = useState<ServicePerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  const calculateRecurrenceRate = (serviceName: string): string => {
    const hash = serviceName.length % 5;
    return `${30 + hash * 2}%`;
  };

  const fetchServicePerformance = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    const token = getToken();

    if (!token) {
      setError('Token de autenticação não encontrado. Redirecionando para login...');
      setIsLoading(false);
      return;
    }

    try {
      
      // CORREÇÃO DA URL para usar o prefixo /api/
      const response = await fetch(`${API_BASE_URL}/admin/desempenho/servicos`, {
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            setError('Sessão expirada. Faça login novamente.');
        }
        throw new Error(`Erro na API: ${response.statusText}`);
      }

      const result: ServicePerformance[] = await response.json();
      
      const formattedData = result.map(item => ({
        ...item,
        recorrencia: calculateRecurrenceRate(item.servico),
        receita: `R$ ${parseFloat(item.receita).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      }));

      setData(formattedData);

    } catch (error) {
      console.error('Falha ao buscar desempenho dos serviços:', error);
      setData([]);
      setError(`Não foi possível carregar os dados. ${error instanceof Error ? error.message : ''}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServicePerformance();
  }, [fetchServicePerformance]);


  const barChartDataset = data.map(item => ({
    service: item.servico,
    popularity: item.popularidade, 
  }));
  
  
  const chartSetting = {
    xAxis: [
      {
        label: 'Popularidade (Contagem de Serviços)',
      },
    ],
    height: 300,
    margin: { left: 80 },
  };


  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
     return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: '#d32f2f' 
      }}>
        <h2>Erro: {error}</h2>
      </Box>
    );
  }


  return (
    <main className={styles.desempenho}>
      <h2>Visão geral do desempenho do serviço</h2>
      <p>Analise a popularidade do serviço, a receita e as tendências de retenção de clientes.</p>
      
      
      <div className={styles.block}>
        <h3>Uso do serviço</h3>
        <TableContainer component={Paper} sx={{ borderRadius: '12px' }}>
          <Table sx={{ minWidth: 750 }} aria-label="tabela de desempenho de serviços">
            <TableHead>
              <TableRow>
                <TableCell>Serviço</TableCell>
                <TableCell>Clientes Atendidos</TableCell>
                <TableCell>Receita gerada</TableCell>
                <TableCell>Taxa de recorrência</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.servico}</TableCell>
                  <TableCell sx={{ color: '#a66a7b', fontWeight: 500 }}>{row.clientes}</TableCell>
                  <TableCell sx={{ color: '#a66a7b' }}>{row.receita}</TableCell>
                  <TableCell sx={{ color: '#a66a7b' }}>{row.recorrencia}</TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">Nenhum dado de desempenho encontrado.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      
      
      <div className={styles.block}>
        <h3>Top Services</h3>
        <div className={styles.charts_list}>
          
          
          <div className={styles.charts_list_item}>
            <h4>Serviços mais populares</h4>
            <BarChart
              dataset={barChartDataset}
              yAxis={[{ scaleType: 'band', dataKey: 'service' }]}
              series={[
                {
                  dataKey: 'popularity',
                  label: 'Contagem de Serviços',
                  color: '#d2b8c4',
                },
              ]}
              layout="horizontal"
              {...chartSetting}
            />
          </div>
          
          
          
          <div className={styles.charts_list_item}>
            <h4>Tendência de serviço ao longo do tempo</h4>
            <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
              series={[
                {
                  data: [2, 5.5, 2, 8.5, 1.5, 5],
                },
              ]}
              height={300}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
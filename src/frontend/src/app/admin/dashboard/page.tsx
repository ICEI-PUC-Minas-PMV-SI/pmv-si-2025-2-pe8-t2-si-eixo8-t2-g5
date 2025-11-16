'use client';

import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import styles from './page.module.scss';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import Button from '@mui/material/Button';
import Link from 'next/link';
import CircularProgress from '@mui/material/CircularProgress';

interface DashboardStats {
  faturamentoMes: number;
  servicosMaisProcurados: string[];
  novosClientesMes: number;
  agendamentosChart: {
    labels: string[];
    data: number[];
  };
  faturamentoChart: {
    labels: string[];
    data: number[];
  };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch('http://localhost:7208/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao carregar dados do dashboard');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        console.error('Erro ao buscar stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const formatMonthLabel = (label: string) => {
    const [year, month] = label.split('-');
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return (
      <div className={styles.admin_dashboard} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className={styles.admin_dashboard}>
        <h2>Dashboard</h2>
        <p style={{ color: 'red' }}>Erro ao carregar dados: {error}</p>
      </div>
    );
  }

  const totalAgendamentos = stats.agendamentosChart.data.reduce((sum, val) => sum + val, 0);
  const agendamentoLabels = stats.agendamentosChart.labels.map(formatMonthLabel);
  const faturamentoLabels = stats.faturamentoChart.labels.map(formatMonthLabel);

  return (
    <div className={styles.admin_dashboard}>
      <h2>Dashboard</h2>
      <h3>Visão geral das principais métricas e estatísticas do salão</h3>
      <Grid container spacing={2}>
        <Grid size={4}>
          <div className={styles.dashboard_text_card}>
            <h4>Serviços Mais Procurados</h4>
            <p>{stats.servicosMaisProcurados.join(', ') || 'Nenhum serviço registrado'}</p>
          </div>
        </Grid>
        <Grid size={4}>
          <div className={styles.dashboard_text_card}>
            <h4>Novos Clientes</h4>
            <p>{stats.novosClientesMes} cliente(s) este mês</p>
          </div>
        </Grid>
        <Grid size={4}>
          <div className={styles.dashboard_text_card}>
            <h4>Faturamento Recente</h4>
            <p>{formatCurrency(stats.faturamentoMes)} (Mês Atual)</p>
          </div>
        </Grid>
        <Grid size={6}>
          <div className={styles.dashboard_chart_card}>
            <h4>Número de Agendamentos</h4>
            <h5>{totalAgendamentos}</h5>
            <p>Últimos 6 meses</p>
            <BarChart
              height={260}
              series={[
                {
                  data: stats.agendamentosChart.data,
                  label: 'Agendamentos',
                  id: 'agendamentosId',
                  color: '#252525'
                },
              ]}
              xAxis={[{
                data: agendamentoLabels,
                scaleType: 'band'
              }]}
              yAxis={[{ width: 50 }]}
            />
          </div>
        </Grid>
        <Grid size={6}>
          <div className={styles.dashboard_chart_card}>
            <h4>Faturamento Mensal</h4>
            <h5>{formatCurrency(stats.faturamentoMes)}</h5>
            <p>Últimos 6 meses</p>
            <LineChart
              xAxis={[{
                data: stats.faturamentoChart.labels.map((_, index) => index + 1),
                scaleType: 'linear'
              }]}
              series={[
                {
                  data: stats.faturamentoChart.data,
                  label: 'Faturamento',
                  color: '#252525',
                  curve: 'linear'
                },
              ]}
              height={260}
              margin={{ left: 70 }}
            />
          </div>
        </Grid>
      </Grid>
      <div className={styles.acoes_rapidas}>
        <h4>Ações Rápidas</h4>
        <div className={styles.acoes_rapidas_list}>
          <Button variant="contained">
            <Link href='/admin/clientes?create_new=true'>
              Cadastrar Cliente
            </Link>
          </Button>
          <Button variant="contained">
            <Link href='/admin/desempenho'>
              Visão geral do desempenho
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
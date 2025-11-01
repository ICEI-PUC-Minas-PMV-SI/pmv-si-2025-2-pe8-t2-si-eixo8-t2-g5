import Grid from '@mui/material/Grid';
import styles from './page.module.scss';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import Button from '@mui/material/Button';
import Link from 'next/link';

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export default function AdminDashboardPage() {
  return (
    <div className={styles.admin_dashboard}>
      <h2>Dashboard</h2>
      <h3>Visão geral das principais métricas e estatísticas do salão</h3>
      <Grid container spacing={2}>
        <Grid size={4}>
          <div className={styles.dashboard_text_card}>
            <h4>Serviços Mais Procurados</h4>
            <p>Corte de Cabelo, Manicure, Pedicure</p>
          </div>
        </Grid>
        <Grid size={4}>
          <div className={styles.dashboard_text_card}>
            <h4>Horários de Pico</h4>
            <p>Terças e Quintas, 14h-18h</p>
          </div>
        </Grid>
        <Grid size={4}>
          <div className={styles.dashboard_text_card}>
            <h4>Faturamento Recente</h4>
            <p>R$ 15.000 (Mês Atual)</p>
          </div>
        </Grid>
        <Grid size={6}>
          <div className={styles.dashboard_chart_card}>
            <h4>Número de Agendamentos</h4>
            <h5>120</h5>
            <p>Últimos 6 meses</p>
            <BarChart
              height={260}
              series={[
                { data: pData, label: 'pv', id: 'pvId', color: '#909090' },
                { data: uData, label: 'uv', id: 'uvId', color: '#252525' },
              ]}
              xAxis={[{ data: xLabels }]}
              yAxis={[{ width: 50 }]}
            />
          </div>
        </Grid>
        <Grid size={6}>
          <div className={styles.dashboard_chart_card}>
            <h4>Número de Agendamentos</h4>
            <h5>120</h5>
            <p>Últimos 6 meses</p>
            <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
              series={[
                {
                  data: [2, 5.5, 2, 8.5, 1.5, 5],
                  color: '#252525'
                },
              ]}
              height={260}
            />
          </div>
        </Grid>
      </Grid>
      <div className={styles.acoes_rapidas}>
        <h4>Ações Rápidas</h4>
        <div className={styles.acoes_rapidas_list}>
          <Button variant="contained">
            <Link href='/admin/clientes'>
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

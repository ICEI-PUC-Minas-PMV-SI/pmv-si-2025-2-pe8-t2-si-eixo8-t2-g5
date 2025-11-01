'use client';

import TableContainer from '@mui/material/TableContainer';
import styles from './page.module.scss';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';

const services = [
  { servico: 'Haircut & Style', clientes: 250, receita: '$12,500', recorrencia: '35%' },
  { servico: 'Manicure & Pedicure', clientes: 320, receita: '$9,600', recorrencia: '42%' },
  { servico: 'Facial Treatments', clientes: 180, receita: '$7,200', recorrencia: '28%' },
  { servico: 'Massage Therapy', clientes: 150, receita: '$6,000', recorrencia: '30%' },
  { servico: 'Waxing Services', clientes: 200, receita: '$4,000', recorrencia: '38%' },
];

const dataset = [
  { service: 'Haircut & Style', popularity: 70 },
  { service: 'Manicure & Pedicure', popularity: 95 },
  { service: 'Facial Treatments', popularity: 80 },
  { service: 'Massage Therapy', popularity: 75 },
  { service: 'Waxing Services', popularity: 25 },
];

const chartSetting = {
  xAxis: [
    {
      label: 'Popularidade (%)',
    },
  ],
  height: 300,
  margin: { left: 80 },
};

export default function AdminDesempenhoPage() {
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
              {services.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.servico}</TableCell>
                  <TableCell sx={{ color: '#a66a7b', fontWeight: 500 }}>{row.clientes}</TableCell>
                  <TableCell sx={{ color: '#a66a7b' }}>{row.receita}</TableCell>
                  <TableCell sx={{ color: '#a66a7b' }}>{row.recorrencia}</TableCell>
                </TableRow>
              ))}
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
              dataset={dataset}
              yAxis={[{ scaleType: 'band', dataKey: 'service' }]}
              series={[
                {
                  dataKey: 'popularity',
                  label: 'Popularidade',
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

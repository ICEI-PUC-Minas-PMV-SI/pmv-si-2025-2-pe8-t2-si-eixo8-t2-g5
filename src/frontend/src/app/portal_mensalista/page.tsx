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

function createData(
  data: string,
  servico: string,
  profissional: string,
  preco: number,
) {
  return { data, servico, profissional, preco };
}

const rows = [
  createData('2024-07-20', 'Cabelo & Estilo', 'Sofia', 85.00),
  createData('2024-07-10', 'Manicure', 'Isabela', 45.00),
  createData('2024-06-25', 'Facial', 'Olivia', 120.00),
  createData('2024-06-15', 'Tratamento de cabelo', 'Sofia', 150.00),
  createData('2024-06-05', 'Pedicure', 'Isabela', 55.00),
]

export default function PortalMensalista() {
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
              {rows.map((row) => (
                <TableRow
                  key={row.servico}
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
            <p>2</p>
          </div>
          <CalendarTodayIcon />
        </div>
        <Button variant="contained">
          <DownloadIcon />
          Gerar Relatório (PDF)
        </Button>
      </div>
    </main>
  );
}

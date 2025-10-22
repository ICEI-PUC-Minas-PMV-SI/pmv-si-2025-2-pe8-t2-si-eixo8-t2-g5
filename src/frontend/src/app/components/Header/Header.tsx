import styles from './Header.module.scss';
import Button from '@mui/material/Button';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import IconButton from '@mui/material/IconButton';

export default function Header() {
  return (
    <header className={styles.header}>
      <ul>
        <li>
          <Button variant="text" size='small'>Início</Button>
        </li>
        <li>
          <Button variant="text" size='small'>Serviços</Button>
        </li>
        <li>
          <Button variant="text" size='small'>Galeria</Button>
        </li>
        <li>
          <Button variant="text" size='small'>Contato</Button>
        </li>
      </ul>
      <img src="images/logo_black.png" alt="Logo" />
      <ul>
        <li>
          <Button variant="text" size='small'>Área do cliente</Button>
        </li>
        <li>
          <Button variant="text" size='small'>Cliente mensalista</Button>
        </li>
        <li>
          <Button variant="contained" className={styles.agendar_btn}>Agendar</Button>
        </li>
        <li>
          <IconButton aria-label="delete">
            <Person2OutlinedIcon />
          </IconButton>
        </li>
        <li>
          <IconButton aria-label="delete">
            <CalendarTodayOutlinedIcon />
          </IconButton>
        </li>
      </ul>
    </header>
  );
}
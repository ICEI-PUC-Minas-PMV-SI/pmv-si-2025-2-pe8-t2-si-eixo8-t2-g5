import styles from './Header.module.scss';
import Button from '@mui/material/Button';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';

export default function Header() {
  return (
    <header className={styles.header}>
      {/* <ul>
        <li>
          <Button variant="text" size='small'>
            <Link href='/home'>
              Início
            </Link>
          </Button>
        </li>
        <li>
          <Button variant="text" size='small'>
            <Link href='/servicos'>
              Serviços
            </Link>
          </Button>
        </li>
        <li>
          <Button variant="text" size='small'>Galeria</Button>
        </li>
        <li>
          <Button variant="text" size='small'>Contato</Button>
        </li>
      </ul> */}
      <Link href='/login'>
        <img src="images/logo_black.png" alt="Logo" />
      </Link>
      <ul>
        {/* <li>
          <Button variant="text" size='small'>Área do cliente</Button>
        </li>
        <li>
          <Button variant="text" size='small'>
            <Link href='/login_mensalista'>
              Cliente mensalista
            </Link>
          </Button>
        </li>
        <li>
          <Button variant="contained" className={styles.agendar_btn}>
            <Link href='/agendamento'>
              Agendar
            </Link>
          </Button>
        </li> */}
        <li>
          <Link href='/login'>
            <IconButton aria-label="delete">
              <Person2OutlinedIcon />
            </IconButton>
          </Link>
        </li>
        {/* <li>
          <IconButton aria-label="delete">
            <CalendarTodayOutlinedIcon />
          </IconButton>
        </li> */}
      </ul>
    </header>
  );
}
'use client'

import styles from './Menu.module.scss';
import Link from 'next/link';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import PeopleIcon from '@mui/icons-material/People';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Button from '@mui/material/Button';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';

export default function AdminMenu() {
  const pathname = usePathname();
  const currentPage = pathname.split('/')[2];

  return (
    <aside className={styles.admin_menu}>
      <p>Admin</p>
      <ul>
        <li>
          <Button variant="text" className={classNames({
            [styles.active]: currentPage === 'dashboard'
          })}>
            <Link href='/'>
              <HomeFilledIcon />
              Dashboard
            </Link>
          </Button>
        </li>
        <li>
          <Button variant="text" className={classNames({
            [styles.active]: currentPage === 'clientes'
          })}>
            <Link href='/'>
              <PeopleIcon />
              Clientes
            </Link>
          </Button>
        </li>
        <li>
          <Button variant="text" className={classNames({
            [styles.active]: currentPage === 'servicos'
          })}>
            <Link href='/'>
              <ContentCutIcon />
              Serviços
            </Link>
          </Button>
        </li>
        <li>
          <Button variant="text" className={classNames({
            [styles.active]: currentPage === 'agendamentos'
          })}>
            <Link href='/'>
              <CalendarTodayIcon />
              Agendamentos
            </Link>
          </Button>
        </li>
        <li>
          <Button variant="text" className={classNames({
            [styles.active]: currentPage === 'pagamentos'
          })}>
            <Link href='/'>
              <CreditCardIcon />
              Pagamentos
            </Link>
          </Button>
        </li>
      </ul>
    </aside>
  );
}

import styles from './Header.module.scss';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href='/login'>
        <Image src="/images/logo_black.png" alt="Logo" />
      </Link>
      <ul>
        <li>
          <Link href='/login'>
            <IconButton aria-label="delete">
              <Person2OutlinedIcon />
            </IconButton>
          </Link>
        </li>
      </ul>
    </header>
  );
}
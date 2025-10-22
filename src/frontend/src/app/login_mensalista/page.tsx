'use client'

import TextField from '@mui/material/TextField';
import styles from './page.module.scss';
import Button from '@mui/material/Button';
import { FormEvent, useState } from 'react';

export default function LoginMensalistaPage() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

  }

  return (
    <main className={styles.login_mensalista}>
      <form onSubmit={submit} className={styles.block}>
        <h2>Cliente Mensalista Login</h2>
        <p>Acesse sua área exclusiva para membros.</p>
        <TextField
          label="Username ou Email"
          variant="outlined"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <TextField
          label="Senha"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="text" className={styles.forgot_password}>Esqueceu sua senha?</Button>
        <Button variant="contained" className={styles.submit} type='submit'>Login</Button>
      </form>
    </main>
  );
}

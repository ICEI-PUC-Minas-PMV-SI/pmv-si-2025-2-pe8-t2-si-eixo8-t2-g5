'use client';

import { FormEvent, useState } from 'react';
import styles from './page.module.scss';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const login = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    router.push('/admin/dashboard');
  }

  return (
    <main className={styles.login}>
      <form onSubmit={login} className={styles.block}>
        <h2>Login</h2>
        <p>Acesse sua conta de administrador usando nome de usuários/email e senha.</p>
        <div className={styles.form_field}>
          <label>Nome de usuário / Email</label>
          <TextField
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
          />
        </div>
        <div className={styles.form_field}>
          <label>Senha</label>
          <OutlinedInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </div>
        <Button disabled={!username || username === '' || !password || password === ''} className={styles.submit_btn} variant="contained" type='submit'>Entrar</Button>
      </form>
    </main>
  );
}

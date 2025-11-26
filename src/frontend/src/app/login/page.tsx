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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username || !password) {
      alert('Preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:7208/api/autenticar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Falha na autenticação');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/admin/dashboard');
    } catch (error) {
      alert(`Erro de conexão com o servidor. Verifique se o backend está rodando: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.login}>
      <form onSubmit={login} className={styles.block}>
        <h2>Login</h2>
        <p>Acesse sua conta de administrador usando nome de usuário ou e-mail e senha.</p>

        <div className={styles.form_field}>
          <label>Nome de usuário / Email</label>
          <TextField
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            fullWidth
            placeholder="Digite seu nome de usuário ou email"
          />
        </div>

        <div className={styles.form_field}>
          <label>Senha</label>
          <OutlinedInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? 'text' : 'password'}
            fullWidth
            placeholder="Digite sua senha"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? 'ocultar senha' : 'mostrar senha'}
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </div>

        <Button
          disabled={loading || !username || !password}
          className={styles.submit_btn}
          variant="contained"
          type="submit"
          fullWidth
          sx={{ mt: 2 }}
          loading={loading}
          loadingPosition="start"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </main>
  );
}
'use client'

import TextField from '@mui/material/TextField';
import styles from './page.module.scss';
import Button from '@mui/material/Button';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert'; 

export default function LoginMensalistaPage() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); 
  
  const router = useRouter();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null); 

    try {
      const response = await fetch('http://localhost:7208/api/autenticar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user, 
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Falha na autenticação');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      router.push('/portal_mensalista');

    } catch (err: any) {
      console.error('Erro no login:', err);
      setError(err.message); 
      setLoading(false);
    }
  };

  return (
    <main className={styles.login_mensalista}>
      <form onSubmit={submit} className={styles.block}>
        <h2>Cliente Mensalista Login</h2>
        <p>Acesse sua área exclusiva para membros.</p>
        
        {error && (
          <Alert severity="error" style={{ width: '100%', marginBottom: '16px' }}>
            {error}
          </Alert>
        )}
        
        <TextField
          label="Nome ou Email" 
          variant="outlined"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          disabled={loading}
          fullWidth 
        />
        <TextField
          label="Senha"
          variant="outlined"
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          fullWidth 
          style={{ marginTop: '16px' }} 
        />
        <Button variant="text" className={styles.forgot_password} disabled={loading}>
          Esqueceu sua senha?
        </Button>
        <Button 
          variant="contained" 
          className={styles.submit} 
          type="submit" 
          disabled={loading} 
          fullWidth 
        >
          {loading ? 'Entrando...' : 'Login'}
        </Button>
      </form>
    </main>
  );
}
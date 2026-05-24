import { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    const url = isRegistering
      ? 'http://localhost:3001/register'
      : 'http://localhost:3001/login';

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.success) {
      onLogin(data.user.username);
    } else {
      setError(data.message);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>💬 ChatApp</h2>
        <p style={styles.subtitle}>
          {isRegistering ? 'Create an account' : 'Welcome back!'}
        </p>

        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.button} onClick={handleSubmit}>
          {isRegistering ? 'Register' : 'Login'}
        </button>

        <p style={styles.toggle}>
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}
          <span
            style={styles.link}
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
          >
            {isRegistering ? ' Login' : ' Register'}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1a1a2e' },
  box: { background: '#16213e', padding: '40px', borderRadius: '12px', width: '320px', display: 'flex', flexDirection: 'column', gap: '12px' },
  title: { color: '#fff', textAlign: 'center', margin: 0 },
  subtitle: { color: '#aaa', textAlign: 'center', margin: 0 },
  input: { padding: '10px', borderRadius: '8px', border: '1px solid #333', background: '#0f3460', color: '#fff', fontSize: '14px' },
  button: { padding: '10px', borderRadius: '8px', background: '#e94560', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '15px' },
  error: { color: '#e94560', margin: 0, fontSize: '13px' },
  toggle: { color: '#aaa', textAlign: 'center', fontSize: '13px' },
  link: { color: '#e94560', cursor: 'pointer' }
};

export default Login;
import { useState, useEffect } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [celebrating, setCelebrating] = useState(false);
  const [emojis, setEmojis] = useState([]);

  function launchEmojis() {
    const items = ['📐', '✏️', '⚙️', '🔩', '📏', '🧮', '💡', '🔧'];
    const launched = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: items[Math.floor(Math.random() * items.length)],
      left: Math.random() * 100,
      duration: 1.5 + Math.random(),
      size: 20 + Math.random() * 20
    }));
    setEmojis(launched);
    setTimeout(() => setEmojis([]), 2500);
  }

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
      if (isRegistering) {
        setCelebrating(true);
        launchEmojis();
        setTimeout(() => {
          setCelebrating(false);
          onLogin(data.user.username);
        }, 2500);
      } else {
        onLogin(data.user.username);
      }
    } else {
      setError(data.message);
    }
  }

  return (
    <div style={styles.container}>

      {/* Flying emojis */}
      {emojis.map(e => (
        <div key={e.id} style={{
          position: 'fixed',
          left: `${e.left}%`,
          bottom: '0',
          fontSize: `${e.size}px`,
          animation: `flyUp ${e.duration}s ease-out forwards`,
          zIndex: 999,
          pointerEvents: 'none'
        }}>
          {e.emoji}
        </div>
      ))}

      <style>{`
        @keyframes flyUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        input::placeholder { color: #667; }
      `}</style>

      <div style={styles.box}>
        <div style={styles.iconRow}>⚙️ 📐 🔧</div>
        <h2 style={styles.title}>
          {celebrating ? '🎉 Welcome Engineer!' : 'Engineer\'s ChatRoom'}
        </h2>
        <p style={styles.subtitle}>
          {celebrating
            ? 'Redirecting to the lab...'
            : isRegistering
            ? 'Join the engineering crew'
            : 'Back to the grind'}
        </p>

        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          disabled={celebrating}
        />
        <input
          style={styles.input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={celebrating}
        />

        {error && <p style={styles.error}>⚠️ {error}</p>}

        <button
          style={{
            ...styles.button,
            animation: celebrating ? 'pulse 0.5s infinite' : 'none'
          }}
          onClick={handleSubmit}
          disabled={celebrating}
        >
          {celebrating ? '🚀 Launching...' : isRegistering ? '📝 Register' : '🔓 Login'}
        </button>

        <p style={styles.toggle}>
          {isRegistering ? 'Already registered?' : 'New engineer?'}
          <span
            style={styles.link}
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
          >
            {isRegistering ? ' Login here' : ' Register here'}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', overflow: 'hidden' },
  box: { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', padding: '40px', borderRadius: '16px', width: '320px', display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' },
  iconRow: { textAlign: 'center', fontSize: '28px', letterSpacing: '8px' },
  title: { color: '#fff', textAlign: 'center', margin: 0, fontSize: '20px' },
  subtitle: { color: '#aaa', textAlign: 'center', margin: 0, fontSize: '13px' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)', color: '#fff', fontSize: '14px', outline: 'none' },
  button: { padding: '12px', borderRadius: '8px', background: 'linear-gradient(90deg, #e94560, #c62a47)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', letterSpacing: '0.5px' },
  error: { color: '#e94560', margin: 0, fontSize: '13px' },
  toggle: { color: '#aaa', textAlign: 'center', fontSize: '13px', margin: 0 },
  link: { color: '#e94560', cursor: 'pointer', fontWeight: 'bold' }
};

export default Login;
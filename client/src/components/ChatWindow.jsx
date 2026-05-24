import { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import UserList from './UserList';
import useWebSocket from '../hooks/useWebSocket';

function ChatWindow({ username }) {
  const { messages, onlineUsers, connected, sendMessage } = useWebSocket(username);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend() {
    if (text.trim() === '') return;
    sendMessage(text);
    setText('');
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') handleSend();
  }

  return (
    <div style={styles.container}>

      {/* Main chat area */}
      <div style={styles.main}>

        {/* Header */}
        <div style={styles.header}>
          <h3 style={styles.headerTitle}>💬 ChatApp</h3>
          <span style={{ color: connected ? '#4caf50' : '#e94560', fontSize: '13px' }}>
            {connected ? '● Connected' : '● Disconnected'}
          </span>
        </div>

        {/* Messages */}
        <div style={styles.messages}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} currentUser={username} />
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div style={styles.inputBar}>
          <input
            style={styles.input}
            placeholder="Type a message..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button style={styles.button} onClick={handleSend}>Send</button>
        </div>
      </div>

      {/* Online users sidebar */}
      <UserList users={onlineUsers} />

    </div>
  );
}

const styles = {
  container: { display: 'flex', height: '100vh', background: '#1a1a2e' },
  main: { flex: 1, display: 'flex', flexDirection: 'column' },
  header: { padding: '16px 20px', background: '#16213e', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', margin: 0 },
  messages: { flex: 1, overflowY: 'auto', padding: '16px 0' },
  inputBar: { display: 'flex', padding: '12px', gap: '10px', background: '#16213e', borderTop: '1px solid #333' },
  input: { flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #333', background: '#0f3460', color: '#fff', fontSize: '14px' },
  button: { padding: '10px 20px', borderRadius: '8px', background: '#e94560', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px' }
};

export default ChatWindow;
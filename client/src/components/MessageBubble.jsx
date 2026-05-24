function MessageBubble({ message, currentUser }) {
  const isMe = message.username === currentUser;
  const isSystem = message.isSystem;

  if (isSystem) {
    return (
      <div style={styles.systemContainer}>
        <span style={styles.systemText}>{message.text}</span>
      </div>
    );
  }

  return (
    <div style={{ ...styles.container, justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
      <div style={{ ...styles.bubble, background: isMe ? '#e94560' : '#0f3460' }}>
        {!isMe && <p style={styles.username}>{message.username}</p>}
        <p style={styles.text}>{message.text}</p>
        <p style={styles.time}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', marginBottom: '8px', paddingInline: '12px' },
  bubble: { maxWidth: '65%', padding: '10px 14px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '4px' },
  username: { margin: 0, fontSize: '11px', color: '#aaa', fontWeight: 'bold' },
  text: { margin: 0, color: '#fff', fontSize: '14px' },
  time: { margin: 0, fontSize: '10px', color: '#ccc', alignSelf: 'flex-end' },
  systemContainer: { display: 'flex', justifyContent: 'center', margin: '8px 0' },
  systemText: { background: '#333', color: '#aaa', fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }
};

export default MessageBubble;
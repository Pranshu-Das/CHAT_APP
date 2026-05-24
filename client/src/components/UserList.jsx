function UserList({ users }) {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Online — {users.length}</h3>
      {users.map((user, index) => (
        <div key={index} style={styles.user}>
          <span style={styles.dot}>●</span>
          <span style={styles.name}>{user}</span>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { width: '200px', background: '#16213e', padding: '20px', borderLeft: '1px solid #333', display: 'flex', flexDirection: 'column', gap: '10px' },
  title: { color: '#aaa', margin: 0, fontSize: '13px', textTransform: 'uppercase' },
  user: { display: 'flex', alignItems: 'center', gap: '8px' },
  dot: { color: '#4caf50', fontSize: '10px' },
  name: { color: '#fff', fontSize: '14px' }
};

export default UserList;
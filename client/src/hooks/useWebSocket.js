import { useState, useEffect, useRef } from 'react';

function useWebSocket(username) {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [connected, setConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    // Connect to your laptop's server
    ws.current = new WebSocket('ws://localhost:3001');

    // When connection opens, announce yourself
    ws.current.onopen = () => {
      setConnected(true);
      ws.current.send(JSON.stringify({
        type: 'join',
        username: username
      }));
    };

    // When a message arrives from server
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'history') {
        setMessages(data.messages);
      }

      if (data.type === 'message') {
        setMessages(prev => [...prev, data.message]);
      }

      if (data.type === 'userList') {
        setOnlineUsers(data.users);
      }

      if (data.type === 'system') {
        setMessages(prev => [...prev, {
          id: Date.now(),
          username: 'System',
          text: data.text,
          timestamp: new Date().toISOString(),
          isSystem: true
        }]);
      }
    };

    // When connection drops
    ws.current.onclose = () => {
      setConnected(false);
    };

    // Cleanup when user leaves
    return () => ws.current.close();
  }, [username]);

  // Function to send a message
  function sendMessage(text) {
    if (ws.current && connected) {
      ws.current.send(JSON.stringify({
        type: 'message',
        username,
        text
      }));
    }
  }

  return { messages, onlineUsers, connected, sendMessage };
}

export default useWebSocket;
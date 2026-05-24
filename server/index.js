const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { registerUser, loginUser } = require('./auth');
const { saveMessage, getRecentMessages } = require('./storage');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
// Allow requests from the client
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Create HTTP server and attach WebSocket to it
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Keep track of who is online
const onlineUsers = new Map();

// REST API - Register
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const result = await registerUser(username, password);
  res.json(result);
});

// REST API - Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await loginUser(username, password);
  res.json(result);
});

// When a user connects via WebSocket
wss.on('connection', (ws) => {
  console.log('New connection established');

  // Send recent messages to the newly connected user
  const recentMessages = getRecentMessages(50);
  ws.send(JSON.stringify({ type: 'history', messages: recentMessages }));

  // When we receive a message from a user
  ws.on('message', (data) => {
    const parsed = JSON.parse(data);

    // User just logged in via WebSocket
    if (parsed.type === 'join') {
      onlineUsers.set(ws, parsed.username);
      broadcastUserList();
      broadcastSystemMessage(`${parsed.username} joined the chat`);
    }

    // User sent a chat message
    if (parsed.type === 'message') {
      const message = {
        id: uuidv4(),
        username: parsed.username,
        text: parsed.text,
        timestamp: new Date().toISOString()
      };
      saveMessage(message);
      broadcast({ type: 'message', message });
    }
  });

  // When a user disconnects
  ws.on('close', () => {
    const username = onlineUsers.get(ws);
    if (username) {
      onlineUsers.delete(ws);
      broadcastUserList();
      broadcastSystemMessage(`${username} left the chat`);
    }
  });
});

// Send a message to ALL connected users
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Send updated online users list to everyone
function broadcastUserList() {
  const users = Array.from(onlineUsers.values());
  broadcast({ type: 'userList', users });
}

// Send system messages like "Pranshu joined"
function broadcastSystemMessage(text) {
  broadcast({ type: 'system', text });
}

// Start the server on port 3001
server.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
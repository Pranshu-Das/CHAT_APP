const fs = require('fs');
const path = require('path');

// Change this to your external drive path when you get it
// For now we save locally in server/data/messages
const MESSAGES_DIR = path.join(__dirname, 'data/messages');

// Make sure the messages folder exists
if (!fs.existsSync(MESSAGES_DIR)) {
  fs.mkdirSync(MESSAGES_DIR, { recursive: true });
}

// Save a message to file
function saveMessage(message) {
  // Each day gets its own file e.g. "2024-01-15.json"
  const today = new Date().toISOString().split('T')[0];
  const filePath = path.join(MESSAGES_DIR, `${today}.json`);

  // Read existing messages for today
  let messages = [];
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    messages = JSON.parse(data);
  }

  // Add new message and save
  messages.push(message);
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
}

// Load recent messages (last 50) to show when user opens chat
function getRecentMessages(limit = 50) {
  // Get all message files sorted by date
  const files = fs.readdirSync(MESSAGES_DIR)
    .filter(f => f.endsWith('.json'))
    .sort()
    .reverse(); // newest first

  let allMessages = [];

  for (const file of files) {
    const filePath = path.join(MESSAGES_DIR, file);
    const data = fs.readFileSync(filePath, 'utf-8');
    const messages = JSON.parse(data);
    allMessages = messages.concat(allMessages);

    if (allMessages.length >= limit) break;
  }

  // Return only the last 'limit' messages
  return allMessages.slice(-limit);
}

module.exports = { saveMessage, getRecentMessages };
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// This is where we save user data on your laptop
const USERS_FILE = path.join(__dirname, 'data/users/users.json');

// If users.json doesn't exist yet, create an empty one
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

// Read all users from file
function getUsers() {
  const data = fs.readFileSync(USERS_FILE, 'utf-8');
  return JSON.parse(data);
}

// Save users back to file
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// REGISTER — when a new user signs up
async function registerUser(username, password) {
  const users = getUsers();

  // Check if username already taken
  const exists = users.find(u => u.username === username);
  if (exists) {
    return { success: false, message: 'Username already taken' };
  }

  // Encrypt the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user object
  const newUser = {
    id: uuidv4(),
    username: username,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  return { success: true, user: { id: newUser.id, username: newUser.username } };
}

// LOGIN — when existing user signs in
async function loginUser(username, password) {
  const users = getUsers();

  // Find user by username
  const user = users.find(u => u.username === username);
  if (!user) {
    return { success: false, message: 'User not found' };
  }

  // Compare entered password with encrypted one
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return { success: false, message: 'Wrong password' };
  }

  return { success: true, user: { id: user.id, username: user.username } };
}

module.exports = { registerUser, loginUser };
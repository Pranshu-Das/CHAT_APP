import { useState } from 'react';
import Login from './components/Login';
import ChatWindow from './components/ChatWindow';

function App() {
  const [username, setUsername] = useState(null);

  return (
    <div>
      {username
        ? <ChatWindow username={username} />
        : <Login onLogin={setUsername} />
      }
    </div>
  );
}

export default App;
import './App.css';
import './styles/app.scss'
import NavBar from './components/Navbar';
import Player from './components/Player';
import { useState } from 'react';

function App() {
  const [isVisible, setVisible] = useState(false);
  return (
    <div className={`App ${isVisible && `app-push`}`}>
      <header className="App-header">
       {/* <NavBar /> */}
       <Player />
      </header>
    </div>
  );
}

export default App;

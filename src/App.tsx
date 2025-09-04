import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

import Home from './pages/Home'
import Mines from './pages/Mines'
import Login from './pages/Login'
import type { User } from './services/api'

export default function App() {
  const [coins, setCoins] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setUsername(userData.username);
        setCoins(userData.coins);
        setIsLoggedIn(true);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (userData: User, token: string) => {
    setUser(userData);
    setUsername(userData.username);
    setCoins(userData.coins);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setUsername('');
    setCoins(0);
    setIsLoggedIn(false);
  };

  const handleTopUp = (newCoins: number) => {
    setCoins(newCoins);
    if (user) {
      const updatedUser = { ...user, coins: newCoins };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const handleCoinsUpdate = (newCoins: number) => {
    setCoins(newCoins);
    if (user) {
      const updatedUser = { ...user, coins: newCoins };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home coins={coins} isLoggedIn={isLoggedIn} username={username} />} />
          <Route path="/login" element={<Login coins={coins} isLoggedIn={isLoggedIn} username={username} onLogin={handleLogin} onLogout={handleLogout} onTopUp={handleTopUp} />} />
          <Route
            path="/mines"
            element={<Mines coins={coins} isLoggedIn={isLoggedIn} username={username} onCoinsUpdate={handleCoinsUpdate} />}
          />
        </Routes>
      </div>
    </Router>
  );
}
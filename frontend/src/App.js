import React, { useState, useEffect } from 'react';
import TournamentsPage from './components/TournamentPage';
import TestsPage from './components/TestsPage';
import AuthPage from './components/AuthPage';
import './App.css';
import UsersPage from './components/UserPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check for existing token on initial load
  useEffect(() => {
    setIsAuthenticated(true); //TODO: DEV MODE - Fix
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token (in a real app, you'd validate it properly)
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentPage('tournaments');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage('home');
  };

  return (
    <div className="app-container">
      <nav className="app-nav">
        <button 
          className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentPage('home')}
        >
          Home
        </button>
        
        {isAuthenticated ? (
          <>
            <button 
              className={`nav-btn ${currentPage === 'tournaments' ? 'active' : ''}`}
              onClick={() => setCurrentPage('tournaments')}
            >
              CRUD Tournaments
            </button>
            <button 
              className={`nav-btn ${currentPage === 'users' ? 'active' : ''}`}
              onClick={() => setCurrentPage('users')}
            >
              CRUD Users
            </button>
            <button 
              className={`nav-btn ${currentPage === 'tests' ? 'active' : ''}`}
              onClick={() => setCurrentPage('tests')}
            >
              API Tests
            </button>
            <button 
              className="nav-btn logout-btn"
              onClick={handleLogout}
            >
              Logout ({user?.username})
            </button>
          </>
        ) : (
          <button 
            className={`nav-btn ${currentPage === 'login' ? 'active' : ''}`}
            onClick={() => setCurrentPage('login')}
          >
            Login
          </button>
        )}
      </nav>

      <main className="app-main">
        {!isAuthenticated && currentPage === 'login' ? (
          <AuthPage onLogin={handleLogin} />
        ) : !isAuthenticated ? (
          <HomePage />
        ) : currentPage === 'tournaments' ? (
          <TournamentsPage user={user} />
        ) : currentPage === 'tests' ? (
          <TestsPage user={user} />
        ) : currentPage === 'users' ? (
          <UsersPage user={user} />
        ) : (
          <HomePage />
        )}
      </main>
    </div>
  );
}

const HomePage = () => (
  <div className="home-page">
    <h1>xxcWsselcome to SmashBrosSpain</h1>
    <p>Your ultimate source for Smash Bros tournaments in Spain!</p>
  </div>
);

export default App;
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Home from './pages/Home';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log('Checking authentication status...');
        const response = await fetch(
          'https://mini-crm-backend-flem.onrender.com/api/auth/status',
          {
            credentials: 'include', // Include cookies
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log('Authentication data:', data);

          setIsAuthenticated(data.isAuthenticated);
        } else {
          console.error('Failed to fetch auth status:', response.statusText);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      console.log('Initiating logout...');
      const response = await fetch(
        'https://mini-crm-backend-flem.onrender.com/api/auth/logout',
        {
          method: 'POST',
          credentials: 'include', // Include cookies to destroy the session
        }
      );

      if (response.ok) {
        console.log('Logout successful');
        setIsAuthenticated(false); // Reset authentication state
      } else {
        console.error('Logout failed:', await response.text());
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    console.log('Loading...');
    return <div>Loading...</div>;
  }

  console.log('Rendering main app...');

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={() => setIsAuthenticated(true)} />}
        />
        <Route
          path="/home/*"
          element={
            isAuthenticated ? (
              <Home onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? '/home' : '/login'} />}
        />
      </Routes>
    </Router>
  );
};

export default App;

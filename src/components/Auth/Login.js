import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(
          'https://mini-crm-backend-flem.onrender.com/api/auth/status',
          {
            credentials: 'include', // Ensure cookies are sent
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log('Authentication data:', data);

          if (data.isAuthenticated) {
            if (data.googleId) {
              localStorage.setItem('googleId', data.googleId);
            } else if (data.userId) {
              localStorage.setItem('userId', data.userId);
            }
            onLogin();
          } else {
            navigate('/login'); // Redirect to login if not authenticated
          }
        } else {
          console.error('Error fetching auth status:', response.statusText);
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
      }
    };

    checkAuthStatus();
  }, [onLogin, navigate]);

  const handleGoogleLogin = () => {
    // Redirect to the backend Google OAuth URL
    window.location.href = 'https://mini-crm-backend-flem.onrender.com/api/auth/google';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch(
        'https://mini-crm-backend-flem.onrender.com/api/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
          credentials: 'include', // Send cookies with the request
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);

        if (data.success) {
          localStorage.setItem('userId', data.userId);
          onLogin();
          navigate('/home'); // Redirect to home after login
        } else {
          setError(data.message || 'Invalid username or password.');
        }
      } else {
        console.error('Login failed:', response.statusText);
        setError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className={styles['login-page']}>
      <div className={styles['left-container']}>
        <h1 className={styles['left-text']}>CRM</h1>
      </div>

      <div className={styles['login-container']}>
        <h1 className={styles['title']}>Welcome to CRM</h1>
        <p className={styles['subtitle']}>Effortlessly build stronger customer connections.</p>
        <div className={styles['login-box']}>
          <form onSubmit={handleLogin} className={styles['login-form']}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles['login-input']}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles['login-input']}
            />
            <button type="submit" className={styles['login-btn']}>
              Login
            </button>
            {error && <div className={styles['error-message']}>{error}</div>}
          </form>

          <button
            onClick={handleGoogleLogin}
            className={styles['login-with-google-btn']}
            style={{ minWidth: '200px' }}
          >
            <span style={{ fontSize: '16px' }}>Login with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import config from '../config';

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        navigate('/');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        
        <button type="submit">Login</button>
        
        <p>Don't have an account? <Link to="/register">Register</Link></p>
        <Link to="/">← Back to Home</Link>
      </form>
    </div>
  );
};

export default Login;
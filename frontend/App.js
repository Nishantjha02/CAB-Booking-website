import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import UserDashboard from './UserDashboard';
import DriverDashboard from './DriverDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home user={user} setUser={setUser} />} />
          <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to={user.role === 'driver' ? '/driver-dashboard' : '/user-dashboard'} />} />
          <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to={user.role === 'driver' ? '/driver-dashboard' : '/user-dashboard'} />} />
          <Route path="/user-dashboard" element={user && user.role === 'user' ? <UserDashboard user={user} setUser={setUser} /> : <Navigate to="/login" />} />
          <Route path="/driver-dashboard" element={user && user.role === 'driver' ? <DriverDashboard user={user} setUser={setUser} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
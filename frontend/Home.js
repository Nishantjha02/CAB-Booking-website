import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ user, setUser }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="home">
      <header className="header">
        <h1>🚗 Cab Booking App</h1>
        <nav>
          {user ? (
            <div>
              <span>Welcome, {user.name}!</span>
              <Link to={user.role === 'driver' ? '/driver-dashboard' : '/user-dashboard'}>
                Dashboard
              </Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          )}
        </nav>
      </header>
      
      <main className="hero">
        <h2>Book Your Ride Today</h2>
        <p>Fast, reliable, and affordable cab booking service</p>
        
        <div className="features">
          <div className="feature">
            <h3>🚀 Quick Booking</h3>
            <p>Book a cab in seconds</p>
          </div>
          <div className="feature">
            <h3>💰 Fair Pricing</h3>
            <p>Transparent and competitive rates</p>
          </div>
          <div className="feature">
            <h3>🛡️ Safe Rides</h3>
            <p>Verified drivers and secure payments</p>
          </div>
        </div>

        {!user && (
          <div className="cta">
            <Link to="/register" className="btn-primary">Get Started</Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
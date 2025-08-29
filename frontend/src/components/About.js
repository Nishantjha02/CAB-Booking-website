import React from 'react';
import { Link } from 'react-router-dom';

const About = ({ user, setUser }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="about-page">
      <header className="header">
        <h1>🚗 Cab Booking App</h1>
        <nav>
          {user ? (
            <div>
              <span>Welcome, {user.name}!</span>
              <Link to={user.role === 'driver' ? '/driver-dashboard' : '/user-dashboard'}>Dashboard</Link>
              <Link to="/booking-history">My Rides</Link>
              <Link to="/">Home</Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
              <Link to="/">Home</Link>
            </div>
          )}
        </nav>
      </header>

      <section className="about-hero">
        <div className="container">
          <h1>Redefining Urban Transportation</h1>
          <p>Safe, reliable, and affordable rides at your fingertips</p>
        </div>
      </section>

      <section className="about-details">
        <div className="about-section">
          <div className="about-text">
            <h2>Revolutionizing Urban Mobility</h2>
            <p>We're transforming the way people move around cities. Our platform connects riders with professional drivers, creating a seamless transportation experience that's safe, reliable, and affordable.</p>
            <div className="about-features">
              <div className="feature-item">
                <div className="feature-icon">🚗</div>
                <div className="feature-text">Instant Booking</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📍</div>
                <div className="feature-text">Real-time Tracking</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💳</div>
                <div className="feature-text">Cashless Payments</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">⭐</div>
                <div className="feature-text">Rated Drivers</div>
              </div>
            </div>
          </div>
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop" alt="Modern Transportation" />
          </div>
        </div>
        
        <div className="about-section">
          <div className="about-text">
            <h2>Safety First</h2>
            <p>Your safety is our top priority. Every driver is thoroughly vetted, and every ride is tracked in real-time. We've built multiple safety features into our platform to ensure you feel secure every step of the way.</p>
            <div className="about-features">
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <div className="feature-text">Background Checks</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📱</div>
                <div className="feature-text">Emergency Button</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">👥</div>
                <div className="feature-text">Share Trip Details</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎆</div>
                <div className="feature-text">24/7 Support</div>
              </div>
            </div>
          </div>
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop" alt="Safe Cab Service" />
          </div>
        </div>
      </section>

      <section className="stats-section">
        <h2>Our Impact</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <h3>10,000+</h3>
            <p>Happy Customers</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚗</div>
            <h3>500+</h3>
            <p>Verified Drivers</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🌍</div>
            <h3>50+</h3>
            <p>Cities Covered</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <h3>4.8/5</h3>
            <p>Average Rating</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🚗 Cab Booking App</h3>
            <p>Your reliable ride partner</p>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>📞 +1 (555) 123-4567</p>
            <p>✉️ support@cabbooking.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Cab Booking App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
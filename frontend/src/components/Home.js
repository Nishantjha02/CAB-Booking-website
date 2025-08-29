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
                {user.role === 'driver' ? 'Driver Panel' : 'Book Ride'}
              </Link>
              {user.role === 'user' && <Link to="/booking-history">My Rides</Link>}
              <Link to="/about">About</Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div>
              <Link to="/about">About</Link>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          )}
        </nav>
      </header>
      
      <main className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h2>Book Your Ride Today</h2>
            <p>Fast, reliable, and affordable cab booking service</p>
            {!user && (
              <div className="cta">
                <Link to="/register" className="btn-primary">Get Started</Link>
                <Link to="/login" className="btn-secondary">Login</Link>
              </div>
            )}
          </div>
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=300&fit=crop" alt="Taxi Service" />
          </div>
        </div>
      </main>

      {(!user || user.role !== 'driver') && (
        <section className="driver-section">
          <div className="container">
            <h2>🚗 Drive with Us</h2>
            <div className="driver-content">
              <div className="driver-text">
                <h3>Become a Driver Partner</h3>
                <p>Join thousands of drivers earning money on their own schedule. Drive when you want, where you want.</p>
                <div className="driver-benefits">
                  <div className="benefit">
                    <span className="benefit-icon">💰</span>
                    <span>Earn Extra Income</span>
                  </div>
                  <div className="benefit">
                    <span className="benefit-icon">⏰</span>
                    <span>Flexible Schedule</span>
                  </div>
                  <div className="benefit">
                    <span className="benefit-icon">📱</span>
                    <span>Easy to Use App</span>
                  </div>
                </div>
                <Link to="/driver-register" className="btn-driver">Start Driving Today</Link>
              </div>
              <div className="driver-image">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop" alt="Happy Driver" />
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features">
          <div className="feature">
            <div className="feature-icon">🚀</div>
            <h3>Quick Booking</h3>
            <p>Book a cab in seconds with our easy-to-use interface</p>
          </div>
          <div className="feature">
            <div className="feature-icon">💰</div>
            <h3>Fair Pricing</h3>
            <p>Transparent and competitive rates with no hidden charges</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🛡️</div>
            <h3>Safe Rides</h3>
            <p>Verified drivers and secure payments for your safety</p>
          </div>
          <div className="feature">
            <div className="feature-icon">📱</div>
            <h3>Real-time Tracking</h3>
            <p>Track your ride in real-time with live updates</p>
          </div>
          <div className="feature">
            <div className="feature-icon">⭐</div>
            <h3>Rated Drivers</h3>
            <p>All drivers are rated and reviewed by customers</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🌍</div>
            <h3>Wide Coverage</h3>
            <p>Available in multiple cities with expanding coverage</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=150&fit=crop" alt="Book Ride" />
              <h3>Book Your Ride</h3>
              <p>Enter pickup and drop locations</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=200&h=150&fit=crop" alt="Driver Accepts" />
              <h3>Driver Accepts</h3>
              <p>Nearby driver accepts your request</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <img src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=200&h=150&fit=crop" alt="Enjoy Ride" />
              <h3>Enjoy Your Ride</h3>
              <p>Sit back and enjoy your journey</p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-about-section">
        <div className="home-about-content">
          <div className="home-about-text">
            <h2>About Our Service</h2>
            <p>We are committed to providing safe, reliable, and affordable transportation solutions. Our platform connects passengers with professional drivers, ensuring a comfortable and secure travel experience.</p>
            <p>With real-time tracking, transparent pricing, and 24/7 customer support, we make urban mobility simple and accessible for everyone.</p>
            <div className="home-stats">
              <div className="home-stat">
                <h3>10K+</h3>
                <p>Happy Customers</p>
              </div>
              <div className="home-stat">
                <h3>500+</h3>
                <p>Verified Drivers</p>
              </div>
              <div className="home-stat">
                <h3>50+</h3>
                <p>Cities Covered</p>
              </div>
            </div>
          </div>
          <div className="home-about-image">
            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop" alt="About Us" />
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🚗 Cab Booking App</h3>
            <p>Your reliable ride partner</p>
            <div className="social-links">
              <a href="#">📘 Facebook</a>
              <a href="#">🐦 Twitter</a>
              <a href="#">📷 Instagram</a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/register">Sign Up</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Safety</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>📞 +1 (555) 123-4567</p>
            <p>✉️ support@cabbooking.com</p>
            <p>📍 123 Main St, City, State</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Cab Booking App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
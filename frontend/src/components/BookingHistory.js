import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BookingHistory = ({ user, setUser }) => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
    // Auto-refresh every 10 seconds to show status updates
    const interval = setInterval(fetchBookings, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/booking/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="dashboard">
      <header className="header">
        <h1>🚗 Cab Booking App</h1>
        <nav>
          <div>
            <span>Welcome, {user.name}!</span>
            <Link to={user.role === 'driver' ? '/driver-dashboard' : '/user-dashboard'}>Book Ride</Link>
            <Link to="/booking-history">My Rides</Link>
            <Link to="/about">About</Link>
            <Link to="/">Home</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </nav>
      </header>

      <main className="dashboard-content">
        <div className="page-header">
          <h2>📋 My Booking History</h2>
          <p>View all your past and current rides (Auto-refreshing)</p>
          <button onClick={fetchBookings} className="btn-secondary" style={{marginTop: '1rem'}}>
            🔄 Refresh Now
          </button>
        </div>

        <div className="bookings-section">
          {bookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🚗</div>
              <h3>No rides yet!</h3>
              <p>Book your first ride to get started</p>
              <Link to="/user-dashboard" className="btn-primary">Book a Ride</Link>
            </div>
          ) : (
            <div className="bookings-grid">
              {bookings.map(booking => (
                <div key={booking._id} className="booking-card-modern">
                  <div className="booking-status-header">
                    <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                    <span className="booking-date">{new Date(booking.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="booking-route">
                    <div className="route-point pickup">
                      <span className="route-icon">🟢</span>
                      <span className="route-address">{booking.pickup.address.split(',')[0]}</span>
                    </div>
                    <div className="route-line"></div>
                    <div className="route-point drop">
                      <span className="route-icon">🔴</span>
                      <span className="route-address">{booking.destination.address.split(',')[0]}</span>
                    </div>
                  </div>

                  <div className="booking-details">
                    <div className="detail-item">
                      <span className="detail-icon">💰</span>
                      <span className="detail-text">${booking.fare}</span>
                    </div>
                    {booking.driver && (
                      <div className="detail-item">
                        <span className="detail-icon">👨‍✈️</span>
                        <span className="detail-text">{booking.driver.name}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <span className="detail-icon">🕒</span>
                      <span className="detail-text">{new Date(booking.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BookingHistory;
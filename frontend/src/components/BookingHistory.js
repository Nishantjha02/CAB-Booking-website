import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import config from '../config';

const BookingHistory = ({ user, setUser }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${config.API_URL}/api/booking/user`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'accepted': return '#2196f3';
      case 'in-progress': return '#4caf50';
      case 'completed': return '#8bc34a';
      case 'cancelled': return '#f44336';
      default: return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'accepted': return '✅';
      case 'in-progress': return '🚗';
      case 'completed': return '🏁';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  return (
    <div className="booking-history">
      <header className="header">
        <h1>🚗 My Rides</h1>
        <nav>
          <div>
            <span>Welcome, {user.name}!</span>
            <Link to="/user-dashboard">Book Ride</Link>
            <Link to="/about">About</Link>
            <Link to="/">Home</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </nav>
      </header>

      <main className="booking-history-content">
        <div className="page-header">
          <h2>📋 Your Booking History</h2>
          <p>Track all your rides and their status</p>
        </div>

        {loading ? (
          <div className="loading">Loading your rides...</div>
        ) : bookings.length === 0 ? (
          <div className="no-bookings">
            <div className="no-bookings-icon">🚗</div>
            <h3>No rides yet!</h3>
            <p>Book your first ride to see it here</p>
            <Link to="/user-dashboard" className="btn-primary">Book a Ride</Link>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <div className="booking-status" style={{ color: getStatusColor(booking.status) }}>
                    {getStatusIcon(booking.status)} {booking.status.toUpperCase()}
                  </div>
                  <div className="booking-date">
                    {new Date(booking.bookingTime).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="booking-route">
                  <div className="route-item">
                    <span className="route-dot pickup">🟢</span>
                    <div className="route-details">
                      <div className="route-label">Pickup</div>
                      <div className="route-address">{booking.pickup.address}</div>
                    </div>
                  </div>
                  
                  <div className="route-line"></div>
                  
                  <div className="route-item">
                    <span className="route-dot drop">🔴</span>
                    <div className="route-details">
                      <div className="route-label">Drop</div>
                      <div className="route-address">{booking.destination.address}</div>
                    </div>
                  </div>
                </div>

                <div className="booking-details">
                  <div className="booking-fare">
                    <span className="fare-label">Fare:</span>
                    <span className="fare-amount">${booking.fare}</span>
                  </div>
                  
                  {booking.driver && (
                    <div className="booking-driver">
                      <span className="driver-label">Driver:</span>
                      <span className="driver-name">{booking.driver.name}</span>
                    </div>
                  )}
                  
                  <div className="booking-time">
                    <span className="time-label">Booked:</span>
                    <span className="time-value">
                      {new Date(booking.bookingTime).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BookingHistory;
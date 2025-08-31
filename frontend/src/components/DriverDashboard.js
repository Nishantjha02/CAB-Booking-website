import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import config from '../config';

const DriverDashboard = ({ user, setUser }) => {
  const [availableBookings, setAvailableBookings] = useState([]);
  const [myBookings, setMyBookings] = useState([]);

  useEffect(() => {
    fetchAvailableBookings();
    fetchMyBookings();
    // Auto-refresh every 5 seconds for drivers
    const interval = setInterval(() => {
      fetchAvailableBookings();
      fetchMyBookings();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAvailableBookings = async () => {
    try {
      const response = await fetch(`${config.API_URL}/api/booking/available`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setAvailableBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching available bookings:', error);
      setAvailableBookings([]);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const response = await fetch(`${config.API_URL}/api/booking/driver`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setMyBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching my bookings:', error);
      setMyBookings([]);
    }
  };

  const acceptBooking = async (bookingId) => {
    try {
      const response = await fetch(`${config.API_URL}/api/booking/${bookingId}/accept`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ driverId: user._id })
      });

      if (response.ok) {
        alert('✅ Booking accepted successfully!');
        fetchAvailableBookings();
        fetchMyBookings();
      } else {
        alert('❌ Failed to accept booking. It may have been taken by another driver.');
      }
    } catch (error) {
      console.error('Error accepting booking:', error);
      alert('❌ Error accepting booking. Please try again.');
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const response = await fetch(`${config.API_URL}/api/booking/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchMyBookings();
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const updateDriverAvailability = async (isAvailable) => {
    try {
      const response = await fetch(`${config.API_URL}/api/booking/availability`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isAvailable })
      });
      
      if (response.ok) {
        setUser({...user, isAvailable});
        fetchAvailableBookings();
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="dashboard">
      <header className="header">
        <h1>🚕 Driver Panel</h1>
        <nav>
          <div>
            <span>Welcome, {user.name}!</span>
            <span className="driver-stats-inline">
              📍 {user.location?.address?.split(',')[0] || 'Location not set'}
            </span>
            <span className="driver-stats-inline">
              {availableBookings.length} Available | {myBookings.length} Active
            </span>
            <span className={`availability-status ${user.isAvailable ? 'available' : 'busy'}`}>
              {user.isAvailable ? '🟢 Available' : '🔴 Busy'}
            </span>
            {!user.isAvailable && (
              <button 
                onClick={() => updateDriverAvailability(true)} 
                className="btn-secondary"
                title="Mark yourself as available"
              >
                Finish Ride
              </button>
            )}
            <Link to="/">Home</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </nav>
      </header>

      <main className="dashboard-content">
        <div className="available-bookings-section">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2>Available Bookings ({availableBookings.length})</h2>
            <button onClick={fetchAvailableBookings} className="btn-secondary">
              🔄 Refresh
            </button>
          </div>
          {availableBookings.length === 0 ? (
            <p>No available bookings at the moment.</p>
          ) : (
            <div className="bookings-list">
              {availableBookings.map(booking => (
                <div key={booking._id} className="booking-card available-booking">
                  <div className="booking-header">
                    <div className="customer-info">
                      <span className="customer-icon">👤</span>
                      <div>
                        <span className="customer-name">{booking.user.name}</span>
                        <span className="customer-phone">{booking.user.phone}</span>
                      </div>
                    </div>
                    <div className="booking-fare">
                      <span className="fare-amount">${booking.fare}</span>
                    </div>
                  </div>
                  
                  <div className="booking-route">
                    <div className="route-point">
                      <span className="route-icon">🟢</span>
                      <span className="route-address">{booking.pickup.address.split(',')[0]}</span>
                    </div>
                    <div className="route-line"></div>
                    <div className="route-point">
                      <span className="route-icon">🔴</span>
                      <span className="route-address">{booking.destination.address.split(',')[0]}</span>
                    </div>
                  </div>
                  
                  <div className="booking-details">
                    <div className="detail-item">
                      <span className="detail-icon">🕰️</span>
                      <span className="detail-text">{new Date(booking.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <span className="detail-text">Nearby</span>
                    </div>
                  </div>
                  
                  <div className="booking-actions">
                    <button 
                      className="btn-accept"
                      onClick={() => acceptBooking(booking._id)}
                    >
                      🚗 Accept Ride
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="my-bookings-section">
          <h2>My Active Bookings</h2>
          {myBookings.length === 0 ? (
            <p>No active bookings.</p>
          ) : (
            <div className="bookings-list">
              {myBookings.map(booking => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-info">
                    <p><strong>Customer:</strong> {booking.user.name} ({booking.user.phone})</p>
                    <p><strong>From:</strong> {booking.pickup.address}</p>
                    <p><strong>To:</strong> {booking.destination.address}</p>
                    <p><strong>Fare:</strong> ${booking.fare}</p>
                    <p><strong>Status:</strong> <span className={`status ${booking.status}`}>{booking.status}</span></p>
                    <p><strong>Booked:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
                  </div>
                  
                  <div className="booking-actions">
                    {booking.status === 'accepted' && (
                      <button 
                        className="btn-primary"
                        onClick={() => updateBookingStatus(booking._id, 'in-progress')}
                      >
                        Start Trip
                      </button>
                    )}
                    {booking.status === 'in-progress' && (
                      <button 
                        className="btn-success"
                        onClick={() => updateBookingStatus(booking._id, 'completed')}
                      >
                        Complete Trip
                      </button>
                    )}
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

export default DriverDashboard;
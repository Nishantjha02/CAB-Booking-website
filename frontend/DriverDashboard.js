import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DriverDashboard = ({ user, setUser }) => {
  const [availableBookings, setAvailableBookings] = useState([]);
  const [myBookings, setMyBookings] = useState([]);

  useEffect(() => {
    fetchAvailableBookings();
    fetchMyBookings();
  }, []);

  const fetchAvailableBookings = async () => {
    try {
      const response = await fetch('/api/booking/available', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setAvailableBookings(data);
    } catch (error) {
      console.error('Error fetching available bookings:', error);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const response = await fetch('/api/booking/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setMyBookings(data.filter(booking => booking.driver && booking.driver._id === user.id));
    } catch (error) {
      console.error('Error fetching my bookings:', error);
    }
  };

  const acceptBooking = async (bookingId) => {
    try {
      const response = await fetch(`/api/booking/${bookingId}/accept`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        fetchAvailableBookings();
        fetchMyBookings();
      }
    } catch (error) {
      console.error('Error accepting booking:', error);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const response = await fetch(`/api/booking/${bookingId}/status`, {
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Driver Dashboard</h1>
        <div>
          <span>Welcome, {user.name}!</span>
          <Link to="/">Home</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="available-bookings-section">
          <h2>Available Bookings</h2>
          {availableBookings.length === 0 ? (
            <p>No available bookings at the moment.</p>
          ) : (
            <div className="bookings-list">
              {availableBookings.map(booking => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-info">
                    <p><strong>Customer:</strong> {booking.user.name} ({booking.user.phone})</p>
                    <p><strong>From:</strong> {booking.pickup.address}</p>
                    <p><strong>To:</strong> {booking.destination.address}</p>
                    <p><strong>Fare:</strong> ${booking.fare}</p>
                    <p><strong>Booked:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
                  </div>
                  <button 
                    className="btn-primary"
                    onClick={() => acceptBooking(booking._id)}
                  >
                    Accept Booking
                  </button>
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
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserDashboard = ({ user, setUser }) => {
  const [bookings, setBookings] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    pickup: { address: '', lat: 0, lng: 0 },
    destination: { address: '', lat: 0, lng: 0 },
    fare: 0
  });

  useEffect(() => {
    fetchBookings();
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

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        setShowBookingForm(false);
        setBookingData({
          pickup: { address: '', lat: 0, lng: 0 },
          destination: { address: '', lat: 0, lng: 0 },
          fare: 0
        });
        fetchBookings();
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>User Dashboard</h1>
        <div>
          <span>Welcome, {user.name}!</span>
          <Link to="/">Home</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="booking-section">
          <h2>Book a Cab</h2>
          <button 
            className="btn-primary"
            onClick={() => setShowBookingForm(!showBookingForm)}
          >
            {showBookingForm ? 'Cancel' : 'New Booking'}
          </button>

          {showBookingForm && (
            <form className="booking-form" onSubmit={handleBooking}>
              <h3>Book Your Ride</h3>
              
              <div className="form-group">
                <label>Pickup Location</label>
                <input
                  type="text"
                  placeholder="Enter pickup address"
                  value={bookingData.pickup.address}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    pickup: { ...bookingData.pickup, address: e.target.value }
                  })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Destination</label>
                <input
                  type="text"
                  placeholder="Enter destination address"
                  value={bookingData.destination.address}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    destination: { ...bookingData.destination, address: e.target.value }
                  })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Estimated Fare ($)</label>
                <input
                  type="number"
                  placeholder="Enter fare amount"
                  value={bookingData.fare}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    fare: parseFloat(e.target.value)
                  })}
                  required
                />
              </div>

              <button type="submit" className="btn-primary">Book Now</button>
            </form>
          )}
        </div>

        <div className="bookings-section">
          <h2>Your Bookings</h2>
          {bookings.length === 0 ? (
            <p>No bookings yet. Book your first ride!</p>
          ) : (
            <div className="bookings-list">
              {bookings.map(booking => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-info">
                    <p><strong>From:</strong> {booking.pickup.address}</p>
                    <p><strong>To:</strong> {booking.destination.address}</p>
                    <p><strong>Fare:</strong> ${booking.fare}</p>
                    <p><strong>Status:</strong> <span className={`status ${booking.status}`}>{booking.status}</span></p>
                    {booking.driver && (
                      <p><strong>Driver:</strong> {booking.driver.name} ({booking.driver.phone})</p>
                    )}
                    <p><strong>Booked:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
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

export default UserDashboard;
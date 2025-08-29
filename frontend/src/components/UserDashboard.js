import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MapBooking from './MapBooking';

const UserDashboard = ({ user, setUser }) => {
  const [bookings, setBookings] = useState([]);


  useEffect(() => {
    fetchBookings();
    // Check for booking updates every 3 seconds
    const interval = setInterval(() => {
      fetchBookings();
    }, 3000);
    return () => clearInterval(interval);
  }, [fetchBookings]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/booking/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      
      // Check for newly accepted bookings
      const previousBookings = bookings;
      const newlyAccepted = data.filter(booking => 
        booking.status === 'accepted' && 
        previousBookings.find(prev => prev._id === booking._id && prev.status === 'pending')
      );
      
      if (newlyAccepted.length > 0) {
        newlyAccepted.forEach(booking => {
          alert(`🎉 Great news! Your ride has been accepted by ${booking.driver?.name || 'a driver'}!`);
        });
      }
      
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleMapBooking = async (bookingData) => {
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
        alert('🎉 Ride booked successfully! Your booking has been confirmed.');
        window.location.href = '/booking-history';
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('❌ Failed to book ride. Please try again.');
    }
  };



  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="dashboard">
      <header className="header">
        <h1>🚗 Book Your Ride</h1>
        <nav>
          <div>
            <span>Welcome, {user.name}!</span>
            <Link to="/booking-history">My Rides</Link>
            <Link to="/about">About</Link>
            <Link to="/">Home</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </nav>
      </header>

      <main className="dashboard-content">
        <div className="page-header">
          <h2>🚗 Book Your Ride</h2>
          <p>Choose your pickup and drop locations to get started</p>
        </div>
        
        <div className="booking-container">
          <MapBooking onBookingSubmit={handleMapBooking} />
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
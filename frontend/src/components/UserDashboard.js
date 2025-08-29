import React from 'react';
import { Link } from 'react-router-dom';
import MapBooking from './MapBooking';
import config from '../config';

const UserDashboard = ({ user, setUser }) => {
  // const [bookings, setBookings] = useState([]);


  // const fetchBookings = useCallback(async () => {
  //   try {
  //     const response = await fetch('/api/booking/user', {
  //       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  //     });
  //     const data = await response.json();
      
  //     setBookings(data);
  //   } catch (error) {
  //     console.error('Error fetching bookings:', error);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchBookings();
  // }, [fetchBookings]);



  const handleMapBooking = async (bookingData) => {
    try {
      console.log('Booking API URL:', config.API_URL);
      const response = await fetch(`${config.API_URL}/api/booking`, {
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
      } else {
        const errorData = await response.json();
        console.error('Booking error:', errorData);
        alert(`❌ Failed to book ride: ${errorData.message || 'Please try again.'}`);
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
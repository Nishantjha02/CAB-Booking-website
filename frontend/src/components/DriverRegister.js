import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const DriverRegister = ({ setUser }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setIsLoggedIn(true);
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsLoggedIn(false);
    setCurrentUser(null);
  };
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    vehicleType: '',
    vehicleNumber: '',
    licenseNumber: '',
    location: { lat: 0, lng: 0, address: '' }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [locationLoading, setLocationLoading] = useState(false);
  const navigate = useNavigate();

  const vehicleTypes = [
    { id: 'bike', name: 'Bike', icon: '🏍️' },
    { id: 'auto', name: 'Auto Rickshaw', icon: '🛺' },
    { id: 'car', name: 'Car', icon: '🚗' },
    { id: 'suv', name: 'SUV', icon: '🚙' }
  ];

  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Get address from coordinates using reverse geocoding
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
            );
            const data = await response.json();
            
            setFormData(prev => ({
              ...prev,
              location: {
                lat: latitude,
                lng: longitude,
                address: data.display_name || `${latitude}, ${longitude}`
              }
            }));
          } catch (error) {
            setFormData(prev => ({
              ...prev,
              location: {
                lat: latitude,
                lng: longitude,
                address: `${latitude}, ${longitude}`
              }
            }));
          }
          setLocationLoading(false);
        },
        (error) => {
          setError('Unable to get your location. Please enter manually.');
          setLocationLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLocationLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLocationChange = (e) => {
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        address: e.target.value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const submitData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: 'driver',
      vehicleType: formData.vehicleType,
      vehicleNumber: formData.vehicleNumber,
      licenseNumber: formData.licenseNumber,
      location: formData.location
    };
    
    console.log('Submitting driver registration:', submitData);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        navigate('/driver-dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.phone) {
        setError('Please fill in all personal details');
        return;
      }
    } else if (step === 2) {
      if (!formData.vehicleType || !formData.vehicleNumber || !formData.licenseNumber) {
        setError('Please fill in all vehicle details');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
    setError('');
  };

  if (isLoggedIn && currentUser) {
    return (
      <div className="driver-register-page">
        <header className="header">
          <h1>🚗 Cab Booking App</h1>
          <nav>
            <Link to="/">Home</Link>
            <button onClick={handleLogout}>Logout</button>
          </nav>
        </header>
        <div className="register-container">
          <div className="register-card">
            <div className="register-header">
              <h2>⚠️ Already Logged In</h2>
              <p>You're currently logged in as {currentUser.name}</p>
            </div>
            <div className="step-content">
              <p>To register as a driver, you need to logout first.</p>
              <div className="step-actions">
                <Link to="/" className="btn-back">← Go Home</Link>
                <button onClick={handleLogout} className="btn-register">
                  Logout & Register as Driver
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="driver-register-page">
      <header className="header">
        <h1>🚗 Cab Booking App</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>

      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h2>🚗 Become a Driver</h2>
            <p>Join our driver community and start earning</p>
          </div>

          <div className="progress-bar">
            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Personal Info</span>
            </div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Vehicle Details</span>
            </div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-label">Location</span>
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="step-content">
                <h3>📝 Personal Information</h3>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    required
                  />
                </div>
                <button type="button" onClick={nextStep} className="btn-next">
                  Next: Vehicle Details →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="step-content">
                <h3>🚗 Vehicle Information</h3>
                <div className="form-group">
                  <label>Vehicle Type</label>
                  <div className="vehicle-selection">
                    {vehicleTypes.map(vehicle => (
                      <div
                        key={vehicle.id}
                        className={`vehicle-option ${formData.vehicleType === vehicle.id ? 'selected' : ''}`}
                        onClick={() => setFormData({...formData, vehicleType: vehicle.id})}
                      >
                        <span className="vehicle-icon">{vehicle.icon}</span>
                        <span className="vehicle-name">{vehicle.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Vehicle Number</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    placeholder="e.g., MH 01 AB 1234"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Driving License Number</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    placeholder="e.g., DL-1420110012345"
                    required
                  />
                </div>
                <div className="step-actions">
                  <button type="button" onClick={prevStep} className="btn-back">
                    ← Back
                  </button>
                  <button type="button" onClick={nextStep} className="btn-next">
                    Next: Location →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="step-content">
                <h3>📍 Your Location</h3>
                <p>We need your location to match you with nearby ride requests.</p>
                
                <div className="location-section">
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="btn-location"
                    disabled={locationLoading}
                  >
                    {locationLoading ? '🔄 Getting Location...' : '📍 Use Current Location'}
                  </button>
                  
                  <div className="divider">
                    <span>OR</span>
                  </div>
                  
                  <div className="form-group">
                    <label>Enter Your Address</label>
                    <textarea
                      value={formData.location.address}
                      onChange={handleLocationChange}
                      placeholder="Enter your current address or area"
                      rows="3"
                      required
                    />
                  </div>
                  
                  {formData.location.lat !== 0 && (
                    <div className="location-preview">
                      <h4>📍 Selected Location:</h4>
                      <p>{formData.location.address}</p>
                      <small>Lat: {formData.location.lat.toFixed(6)}, Lng: {formData.location.lng.toFixed(6)}</small>
                    </div>
                  )}
                </div>

                <div className="step-actions">
                  <button type="button" onClick={prevStep} className="btn-back">
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="btn-register"
                    disabled={loading || !formData.location.address}
                  >
                    {loading ? '🔄 Creating Account...' : '🚗 Start Driving'}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="register-footer">
            <p>Already have an account? <Link to="/login">Login here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverRegister;
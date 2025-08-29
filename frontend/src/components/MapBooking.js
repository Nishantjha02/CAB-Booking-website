import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const pickupIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="#4CAF50"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const dropIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="#F44336"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Component to control map view
const MapController = ({ pickupLocation, dropLocation, routeCoordinates }) => {
  const map = useMap();

  useEffect(() => {
    if (pickupLocation && dropLocation) {
      const bounds = L.latLngBounds([
        [pickupLocation.lat, pickupLocation.lng],
        [dropLocation.lat, dropLocation.lng]
      ]);
      
      if (routeCoordinates.length > 0) {
        routeCoordinates.forEach(coord => bounds.extend(coord));
      }
      
      map.fitBounds(bounds, { padding: [20, 20] });
    } else if (pickupLocation) {
      map.setView([pickupLocation.lat, pickupLocation.lng], 15);
    } else if (dropLocation) {
      map.setView([dropLocation.lat, dropLocation.lng], 15);
    }
  }, [map, pickupLocation, dropLocation, routeCoordinates]);

  return null;
};

const vehicleTypes = [
  {
    id: 'bike',
    name: 'Bike',
    icon: '🏍️',
    description: '1 rider',
    baseRate: 1.0,
    perKm: 0.8
  },
  {
    id: 'auto',
    name: 'Auto',
    icon: '🛺',
    description: '3 seater',
    baseRate: 1.5,
    perKm: 1.2
  },
  {
    id: 'car',
    name: 'Car',
    icon: '🚗',
    description: '4 seater',
    baseRate: 2.0,
    perKm: 1.5
  },
  {
    id: 'suv',
    name: 'SUV',
    icon: '🚙',
    description: '6-7 seater',
    baseRate: 3.0,
    perKm: 2.0
  }
];

const MapBooking = ({ onBookingSubmit }) => {
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropLocation, setDropLocation] = useState(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropAddress, setDropAddress] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropSuggestions, setShowDropSuggestions] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [distance, setDistance] = useState(0);
  const [estimatedFare, setEstimatedFare] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(vehicleTypes[2]); // Default to car
  const [currentStep, setCurrentStep] = useState(1);
  
  const mapRef = useRef();

  // Search for addresses using Nominatim (OpenStreetMap)
  const searchAddress = async (query, setSuggestions, setShowSuggestions) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(data.length > 0);
    } catch (error) {
      console.error('Error searching address:', error);
    }
  };

  // Get route using OSRM (free routing service)
  const getRoute = async (pickup, drop) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${drop.lng},${drop.lat}?overview=full&geometries=geojson&steps=true`
      );
      const data = await response.json();
      
      if (data.routes && data.routes[0]) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        setRouteCoordinates(coordinates);
        
        const distanceKm = route.distance / 1000;
        setDistance(distanceKm);
        const fare = Math.round((selectedVehicle.baseRate + (distanceKm * selectedVehicle.perKm)) * 100) / 100;
        setEstimatedFare(fare);
      }
    } catch (error) {
      console.error('Error getting route:', error);
      // Fallback: create straight line and calculate distance
      const coordinates = [
        [pickup.lat, pickup.lng],
        [drop.lat, drop.lng]
      ];
      setRouteCoordinates(coordinates);
      
      const distanceKm = calculateStraightDistance(pickup, drop);
      setDistance(distanceKm);
      const fare = Math.round((selectedVehicle.baseRate + (distanceKm * selectedVehicle.perKm)) * 100) / 100;
      setEstimatedFare(fare);
    }
    setLoading(false);
  };

  const calculateStraightDistance = (pickup, drop) => {
    const R = 6371;
    const dLat = (drop.lat - pickup.lat) * Math.PI / 180;
    const dLng = (drop.lng - pickup.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(pickup.lat * Math.PI / 180) * Math.cos(drop.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const selectAddress = (suggestion, isPickup) => {
    const location = {
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon)
    };
    
    if (isPickup) {
      setPickupLocation(location);
      setPickupAddress(suggestion.display_name);
      setShowPickupSuggestions(false);
    } else {
      setDropLocation(location);
      setDropAddress(suggestion.display_name);
      setShowDropSuggestions(false);
    }
  };

  useEffect(() => {
    if (pickupLocation && dropLocation) {
      getRoute(pickupLocation, dropLocation);
    }
  }, [pickupLocation, dropLocation, selectedVehicle, getRoute]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pickupLocation || !dropLocation) {
      alert('Please select both pickup and drop locations');
      return;
    }

    const bookingData = {
      pickup: {
        address: pickupAddress,
        lat: pickupLocation.lat,
        lng: pickupLocation.lng
      },
      destination: {
        address: dropAddress,
        lat: dropLocation.lat,
        lng: dropLocation.lng
      },
      fare: estimatedFare,
      vehicleType: selectedVehicle.id
    };

    onBookingSubmit(bookingData);
  };

  // const resetLocations = () => {
    setPickupLocation(null);
    setDropLocation(null);
    setPickupAddress('');
    setDropAddress('');
    setRouteCoordinates([]);
    setDistance(0);
    setEstimatedFare(0);
    setPickupSuggestions([]);
    setDropSuggestions([]);
    setShowPickupSuggestions(false);
    setShowDropSuggestions(false);
    setSelectedVehicle(vehicleTypes[2]);
    setCurrentStep(1);
  // };

  return (
    <div className="modern-booking">
      <div className="booking-steps">
        <div className={`booking-step ${currentStep >= 1 ? 'active' : ''}`}>
          <span className="booking-step-number">1</span>
          <span className="booking-step-label">Locations</span>
        </div>
        <div className={`booking-step ${currentStep >= 2 ? 'active' : ''}`}>
          <span className="booking-step-number">2</span>
          <span className="booking-step-label">Vehicle</span>
        </div>
        <div className={`booking-step ${currentStep >= 3 ? 'active' : ''}`}>
          <span className="booking-step-number">3</span>
          <span className="booking-step-label">Confirm</span>
        </div>
      </div>

      {currentStep === 1 && (
        <div className="step-content">
          <h3>📍 Select Locations</h3>
          <div className="location-inputs">
            <div className="input-group">
              <div className="input-icon">🟢</div>
              <div className="form-group autocomplete-container">
                <input
                  type="text"
                  placeholder="Enter pickup location"
                  value={pickupAddress}
                  onChange={(e) => {
                    setPickupAddress(e.target.value);
                    searchAddress(e.target.value, setPickupSuggestions, setShowPickupSuggestions);
                  }}
                  onFocus={() => pickupSuggestions.length > 0 && setShowPickupSuggestions(true)}
                />
                {showPickupSuggestions && pickupSuggestions.length > 0 && (
                  <div className="suggestions-dropdown">
                    {pickupSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => selectAddress(suggestion, true)}
                      >
                        📍 {suggestion.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="input-group">
              <div className="input-icon">🔴</div>
              <div className="form-group autocomplete-container">
                <input
                  type="text"
                  placeholder="Enter drop location"
                  value={dropAddress}
                  onChange={(e) => {
                    setDropAddress(e.target.value);
                    searchAddress(e.target.value, setDropSuggestions, setShowDropSuggestions);
                  }}
                  onFocus={() => dropSuggestions.length > 0 && setShowDropSuggestions(true)}
                />
                {showDropSuggestions && dropSuggestions.length > 0 && (
                  <div className="suggestions-dropdown">
                    {dropSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => selectAddress(suggestion, false)}
                      >
                        📍 {suggestion.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="map-container">
            <MapContainer
              center={[40.7128, -74.0060]}
              zoom={13}
              style={{ height: '300px', width: '100%' }}
              ref={mapRef}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              
              {pickupLocation && (
                <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={pickupIcon}>
                  <Popup>🚗 Pickup Location</Popup>
                </Marker>
              )}
              
              {dropLocation && (
                <Marker position={[dropLocation.lat, dropLocation.lng]} icon={dropIcon}>
                  <Popup>🏁 Drop Location</Popup>
                </Marker>
              )}
              
              {routeCoordinates.length > 0 && (
                <Polyline
                  positions={routeCoordinates}
                  color="#2196F3"
                  weight={4}
                  opacity={0.8}
                />
              )}
              
              <MapController 
                pickupLocation={pickupLocation}
                dropLocation={dropLocation}
                routeCoordinates={routeCoordinates}
              />
            </MapContainer>
          </div>

          <div className="step-actions">
            <button 
              className="btn-next"
              disabled={!pickupLocation || !dropLocation}
              onClick={() => setCurrentStep(2)}
            >
              Next: Choose Vehicle →
            </button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="step-content">
          <h3>🚗 Choose Your Ride</h3>
          <div className="vehicle-options">
            {vehicleTypes.map(vehicle => {
              const fare = distance > 0 ? Math.round((vehicle.baseRate + (distance * vehicle.perKm)) * 100) / 100 : 0;
              return (
                <div 
                  key={vehicle.id}
                  className={`vehicle-card ${selectedVehicle.id === vehicle.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedVehicle(vehicle);
                    if (distance > 0) {
                      const newFare = Math.round((vehicle.baseRate + (distance * vehicle.perKm)) * 100) / 100;
                      setEstimatedFare(newFare);
                    }
                  }}
                >
                  <div className="vehicle-icon">{vehicle.icon}</div>
                  <div className="vehicle-info">
                    <h4>{vehicle.name}</h4>
                    <p>{vehicle.description}</p>
                    {distance > 0 && <div className="vehicle-fare">${fare}</div>}
                  </div>
                  {selectedVehicle.id === vehicle.id && <div className="selected-check">✓</div>}
                </div>
              );
            })}
          </div>

          <div className="step-actions">
            <button className="btn-back" onClick={() => setCurrentStep(1)}>← Back</button>
            <button className="btn-next" onClick={() => setCurrentStep(3)}>Next: Confirm →</button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="step-content">
          <h3>✅ Confirm Your Booking</h3>
          <div className="booking-summary">
            <div className="summary-section">
              <h4>📍 Trip Details</h4>
              <div className="trip-route">
                <div className="route-item">
                  <span className="route-dot pickup"></span>
                  <span>{pickupAddress.split(',')[0]}</span>
                </div>
                <div className="route-item">
                  <span className="route-dot drop"></span>
                  <span>{dropAddress.split(',')[0]}</span>
                </div>
              </div>
            </div>

            <div className="summary-section">
              <h4>🚗 Vehicle</h4>
              <div className="selected-vehicle">
                <span className="vehicle-icon-large">{selectedVehicle.icon}</span>
                <div>
                  <div className="vehicle-name">{selectedVehicle.name}</div>
                  <div className="vehicle-desc">{selectedVehicle.description}</div>
                </div>
              </div>
            </div>

            <div className="summary-section">
              <h4>💰 Fare Breakdown</h4>
              <div className="fare-details">
                <div className="fare-item">
                  <span>Distance:</span>
                  <span>{distance.toFixed(2)} km</span>
                </div>
                <div className="fare-item">
                  <span>Base fare:</span>
                  <span>${selectedVehicle.baseRate}</span>
                </div>
                <div className="fare-item">
                  <span>Per km (${selectedVehicle.perKm}/km):</span>
                  <span>${(distance * selectedVehicle.perKm).toFixed(2)}</span>
                </div>
                <div className="fare-total">
                  <span>Total:</span>
                  <span>${estimatedFare}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="step-actions">
            <button className="btn-back" onClick={() => setCurrentStep(2)}>← Back</button>
            <button 
              className="btn-book"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? '🔄 Booking...' : `🚗 Book ${selectedVehicle.name} - $${estimatedFare}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapBooking;
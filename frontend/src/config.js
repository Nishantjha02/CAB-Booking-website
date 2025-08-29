const config = {
  API_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:5000'
    : 'https://cab-booking-website-ypg2.onrender.com'
};

export default config;
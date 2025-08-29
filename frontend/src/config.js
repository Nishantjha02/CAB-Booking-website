const config = {
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://cab-booking-backend.railway.app' // Replace with your Railway URL
    : 'http://localhost:5000'
};

export default config;
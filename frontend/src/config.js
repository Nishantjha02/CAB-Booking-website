const config = {
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://cab-booking-website-ypg2.onrender.com' // Your actual Render URL
    : 'http://localhost:5000'
};

export default config;
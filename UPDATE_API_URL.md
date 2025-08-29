# IMPORTANT: Update API URL

After deploying backend to Render, update this file:

frontend/src/config.js

Replace 'https://cab-booking-backend.onrender.com' with your actual Render URL

Example:
const config = {
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-actual-render-url.onrender.com'
    : 'http://localhost:5000'
};
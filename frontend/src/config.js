const config = {
  API_URL: process.env.NODE_ENV === 'production' 
    ? '' // Use relative URLs in production
    : 'http://localhost:5000'
};

export default config;
const config = {
  API_URL: process.env.NODE_ENV === 'production' 
    ? '' // Use relative URLs for Vercel deployment
    : 'http://localhost:5000'
};

export default config;
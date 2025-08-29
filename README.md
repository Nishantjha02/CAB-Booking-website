# Cab Booking Application - MERN Stack

A full-stack cab booking application built with MongoDB, Express.js, React, and Node.js.

## Features

### User Features
- User registration and authentication
- Interactive map for selecting pickup and drop locations
- Automatic fare calculation based on distance
- Book cab rides with pickup and destination
- View booking history
- Real-time booking status updates

### Driver Features
- Driver registration and authentication
- View available booking requests
- Accept booking requests
- Manage trip status (start trip, complete trip)
- View active bookings

### General Features
- JWT-based authentication
- Role-based access control (User/Driver)
- Responsive design
- RESTful API

## Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

**Frontend:**
- React 18
- React Router DOM
- Google Maps React API
- CSS3 for styling

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cab-booking
JWT_SECRET=your_jwt_secret_key_here
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your Google Maps API key:
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

4. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user/driver
- `POST /api/auth/login` - Login user/driver
- `GET /api/auth/me` - Get current user info

### Booking Routes
- `POST /api/booking` - Create new booking (User only)
- `GET /api/booking/user` - Get user's bookings
- `GET /api/booking/available` - Get available bookings (Driver only)
- `PATCH /api/booking/:id/accept` - Accept booking (Driver only)
- `PATCH /api/booking/:id/status` - Update booking status

## Usage

1. **Registration**: Users can register as either a "User" or "Driver"
2. **User Flow**:
   - Login to access user dashboard
   - Create new booking with pickup/destination
   - View booking history and status
3. **Driver Flow**:
   - Login to access driver dashboard
   - View available booking requests
   - Accept bookings and manage trip status

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String (user/driver),
  location: { lat: Number, lng: Number }
}
```

### Booking Model
```javascript
{
  user: ObjectId (ref: User),
  driver: ObjectId (ref: User),
  pickup: { address: String, lat: Number, lng: Number },
  destination: { address: String, lat: Number, lng: Number },
  fare: Number,
  status: String (pending/accepted/in-progress/completed/cancelled),
  bookingTime: Date,
  completedTime: Date
}
```

## Google Maps Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Directions API
   - Geocoding API
4. Create credentials (API Key)
5. Add the API key to your `.env` file

## Future Enhancements

- Real-time notifications using Socket.io
- Payment gateway integration
- Driver location tracking
- Rating and review system
- Admin dashboard
- Mobile app using React Native
- Real-time driver tracking on map

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
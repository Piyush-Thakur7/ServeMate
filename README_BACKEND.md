# ServeMate Backend Setup

This project adds a backend to the ServeMate donation platform with user authentication, profile management, and donation tracking. **No real payment processing** - donations show a UPI interface but don't charge real money.

## Features Implemented

- ✅ User registration and login with JWT authentication
- ✅ Secure password hashing with bcrypt
- ✅ MongoDB database for users and donations
- ✅ User profile and dashboard functionality
- ✅ Donation tracking with XP/level system
- ✅ Fake UPI payment interface (no real payments)
- ✅ RESTful API endpoints

## Features NOT Implemented (as requested)

- ❌ Real payment gateway integration
- ❌ Actual money processing
- ❌ Payment verification with banks
- ❌ Refund processing

## Donation Flow

1. User selects cause and amount
2. Shows UPI payment interface with QR code
3. User clicks any UPI app button
4. Shows "Payment Successful" (fake)
5. Records donation in database
6. Updates user XP and stats

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **MongoDB Setup:**
   - Use MongoDB Atlas (cloud) - get connection string from https://cloud.mongodb.com/
   - Update `.env` file with your MongoDB Atlas URI

3. **Start Server:**
   ```bash
   npm start
   ```

4. **Access App:**
   - Open `http://localhost:5000`
   - Register/Login to access dashboard
   - Try making a donation to see the UPI interface

## API Endpoints

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get user profile
- `POST /api/donations` - Record donation (fake payment)
- `GET /api/donations` - Get user's donations

## Database Models

- **User**: name, email, password, city, xp, level, totalDonated, donationsCount, badges
- **Donation**: user, cause, amount, ngo, location, status, proof, xpEarned

## Security

- Passwords hashed with bcrypt
- JWT tokens for authentication
- Input validation
- No sensitive payment data stored

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info
- `POST /api/donations` - Make a donation
- `GET /api/donations` - Get user's donations
- `GET /api/donations/all` - Get all verified donations

## Database Models

- **User**: name, email, password, city, xp, level, totalDonated, donationsCount, badges
- **Donation**: user, cause, amount, ngo, location, status, proof, xpEarned

## Security

- Passwords are hashed with bcrypt
- JWT tokens for authentication
- Input validation with express-validator
- CORS enabled for frontend requests
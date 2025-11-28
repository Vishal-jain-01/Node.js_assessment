# User Service API - Node.js + Express + MongoDB

Complete implementation of the user management system with 4 APIs optimized for scale (handles millions of users efficiently).

## Features

1. **Create User** - Register new users with location data
2. **Toggle All User Status** - Change all user statuses in a single MongoDB query (no loops)
3. **Get Distance** - Calculate distance between user and destination using Haversine formula
4. **Get User Listing** - Fetch users grouped by weekdays with optimized aggregation

## Setup Instructions

### 1. Install MongoDB

**Windows:**
Download and install from: https://www.mongodb.com/try/download/community

Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

### 2. Install Dependencies

```powershell
npm install
```

### 3. Configure Environment

Edit `.env` file if needed:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/userservice
```

For MongoDB Atlas, use connection string like:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/userservice
```

### 4. Start MongoDB (if local)

```powershell
# Windows - if installed as service, it starts automatically
# Otherwise start manually:
mongod
```

### 5. Run the Server

**Development mode (with auto-reload):**
```powershell
npm run dev
```

**Production mode:**
```powershell
npm start
```

Server will run on http://localhost:3000

## API Endpoints

### 1. Create User
**POST** `/api/users`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "mypassword",
  "address": "123 Main Street",
  "latitude": 28.6139,
  "longitude": 77.2090
}
```

**Response:**
```json
{
  "status_code": 200,
  "message": "User created successfully",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main Street",
    "latitude": "28.6139",
    "longitude": "77.2090",
    "status": "active",
    "register_at": "2025-11-28T10:30:00.000Z",
    "token": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### 2. Toggle All User Status
**POST** `/api/users/toggle-status`

**Headers:**
```
Authorization: Bearer <your-token>
```

**Response:**
```json
{
  "status_code": 200,
  "message": "All user statuses toggled successfully"
}
```

**Implementation:** Uses MongoDB aggregation pipeline update to toggle all statuses in ONE query:
```javascript
await User.updateMany({}, [
  { $set: { status: { $cond: { if: { $eq: ['$status', 'active'] }, then: 'inactive', else: 'active' }}}}
]);
```

### 3. Get Distance
**GET** `/api/distance?destination_lat=28.7041&destination_lon=77.1025`

**Headers:**
```
Authorization: Bearer <your-token>
```

**Response:**
```json
{
  "status_code": 200,
  "message": "Distance calculated successfully",
  "distance": "12.45km"
}
```

### 4. Get User Listing by Weekdays
**GET** `/api/users/listing?week_numbers=0,1,4`

**Headers:**
```
Authorization: Bearer <your-token>
```

**Query Parameters:**
- `week_numbers`: Comma-separated weekday numbers (0=Sunday, 1=Monday, ..., 6=Saturday)

**Response:**
```json
{
  "status_code": 200,
  "message": "Users listed by weekdays",
  "data": {
    "sunday": [
      { "name": "Alice", "email": "alice@example.com" },
      { "name": "Bob", "email": "bob@example.com" }
    ],
    "monday": [
      { "name": "Charlie", "email": "charlie@example.com" }
    ],
    "thursday": [
      { "name": "David", "email": "david@example.com" }
    ]
  }
}
```

**Implementation:** Single MongoDB aggregation query with $dayOfWeek operator - optimized for millions of users.

## Testing with cURL or Postman

### Create User:
```powershell
curl -X POST http://localhost:3000/api/users `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"pass123\",\"latitude\":28.6139,\"longitude\":77.2090}'
```

### Toggle Status (use token from create response):
```powershell
curl -X POST http://localhost:3000/api/users/toggle-status `
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Distance:
```powershell
curl "http://localhost:3000/api/distance?destination_lat=28.7041&destination_lon=77.1025" `
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get User Listing:
```powershell
curl "http://localhost:3000/api/users/listing?week_numbers=0,1,4" `
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Performance Optimizations for Scale (10M+ users)

1. **Database Indexes**: 
   - Token index for fast authentication
   - Email unique index for duplicate prevention
   - register_at index for weekday queries

2. **Single Query Operations**:
   - Status toggle uses aggregation pipeline (no loops)
   - User listing uses aggregation with $dayOfWeek

3. **Efficient Calculations**:
   - Haversine distance computed server-side
   - Optimized mathematical operations

## Production Considerations

⚠️ **Security Notes** (For production deployment):

1. **Password Hashing**: Currently stores plain passwords. Use bcrypt:
   ```javascript
   const bcrypt = require('bcrypt');
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **JWT Tokens**: Replace UUID tokens with JWT for stateless authentication:
   ```javascript
   const jwt = require('jsonwebtoken');
   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
   ```

3. **Rate Limiting**: Add rate limiting middleware to prevent abuse

4. **Input Validation**: Add robust validation (use express-validator)

5. **Error Handling**: Implement centralized error handling

6. **Logging**: Add proper logging (Winston, Morgan)

7. **Pagination**: Add pagination to listing endpoint for very large datasets

## Project Structure

```
Appsinvo/
├── config/
│   └── database.js       # MongoDB connection
├── middleware/
│   └── auth.js           # Token authentication
├── models/
│   └── User.js           # User schema with indexes
├── routes/
│   └── users.js          # All 4 API endpoints
├── utils/
│   └── distance.js       # Haversine distance calculation
├── .env                  # Environment variables
├── .gitignore
├── package.json
├── README.md
└── server.js             # Main application entry
```

## Next Steps for Company Assessment

✅ **Completed:**
- All 4 APIs implemented
- Single-query status toggle (no loops)
- Optimized for scale (10M+ users)
- Clean project structure
- MongoDB with proper indexes

📋 **For Submission:**
1. Test all endpoints thoroughly
2. Add sample data to demonstrate functionality
3. Document any assumptions made
4. Prepare to explain optimization strategies
5. Be ready to discuss scaling approaches

## Common Issues & Solutions

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check connection string in `.env`
- For Atlas, whitelist your IP address

**Port Already in Use:**
- Change PORT in `.env` file
- Or stop other services on port 3000

**Module Not Found:**
- Run `npm install` again
- Delete `node_modules` and reinstall

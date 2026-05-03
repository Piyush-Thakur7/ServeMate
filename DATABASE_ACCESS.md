# Database Access & Monitoring Guide

## How to Access Your Database

### 1. **MongoDB Compass (GUI Tool)**
Download from: https://www.mongodb.com/try/download/compass

**Connection Details:**
- **Connection String:** `mongodb://localhost:27017/servemate`
- **Database:** `servemate`
- **Collections:** `users`, `donations`

**Steps:**
1. Open MongoDB Compass
2. Click "New Connection"
3. Enter: `mongodb://localhost:27017/servemate`
4. Click "Connect"
5. Select "servemate" database
6. View `users` and `donations` collections

### 2. **Command Line Access**
```bash
# Connect to MongoDB shell
mongo

# Switch to your database
use servemate

# View all users
db.users.find({}).pretty()

# View all donations
db.donations.find({}).pretty()

# Count users
db.users.count()

# Count donations
db.donations.count()
```

### 3. **Node.js Scripts (Created for You)**

#### Check Database Content:
```bash
node check-db.js
```
Shows all users and donations.

#### Monitor Database Stats:
```bash
node monitor-db.js
```
Shows recent activity, top donors, total stats.

## Real-Time User Monitoring

### Server Logs
When users login/register, you'll see logs in the terminal where the server is running:

```
👤 NEW USER: John Doe (john@email.com) registered from Mumbai at 2024-01-15T10:30:00.000Z
🔐 USER LOGIN: John Doe (john@email.com) logged in at 2024-01-15T10:31:00.000Z
```

### Active Sessions
Currently, there's no built-in session tracking, but you can see:
- **Recent logins** via server logs
- **User activity** via donation timestamps
- **User stats** via database queries

## Database Schema

### Users Collection
```javascript
{
  name: "John Doe",
  email: "john@email.com",
  password: "hashed_password",
  city: "Mumbai",
  xp: 50,
  level: 3,
  totalDonated: 500,
  donationsCount: 5,
  badges: ["First Donor", "Regular Giver"],
  createdAt: ISODate("2024-01-15T10:30:00.000Z")
}
```

### Donations Collection
```javascript
{
  user: ObjectId("user_id"),
  cause: "Feed the Hungry",
  amount: 100,
  ngo: "ServeMate Foundation",
  location: "Mumbai",
  status: "completed",
  proof: "fake_payment_123",
  xpEarned: 10,
  createdAt: ISODate("2024-01-15T10:35:00.000Z")
}
```

## Security Notes

- **Passwords are hashed** with bcrypt - you cannot see plain passwords
- **JWT tokens** are used for authentication
- **No sensitive payment data** is stored (fake payments only)

## Quick Commands

```bash
# Check server is running
curl http://localhost:5000

# Test API
curl -X GET http://localhost:5000/api/auth/me -H "Authorization: Bearer YOUR_TOKEN"

# View database
node monitor-db.js

# Check users
node check-db.js
```
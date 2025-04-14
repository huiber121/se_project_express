const JWT_SECRET = "your_jwt_secret"; // Replace with your actual secret key

module.exports = {
  JWT_SECRET,
  MONGO_URI: "mongodb://localhost:3001/", // Replace with your actual MongoDB URI
  PORT: process.env.PORT || 3001, // Default to 3000 if PORT is not set in environment variables
};
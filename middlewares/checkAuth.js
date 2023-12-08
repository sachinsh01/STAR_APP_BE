// Import the jsonwebtoken module
const jwt = require("jsonwebtoken");

// Load environment variables in the development environment
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); // Load environment variables
}

// Middleware function to check if the user is authenticated
exports.checkAuth = (req, res, next) => {
  // Extract the token from the request headers
  const token = req.headers["authorization"].split(" ")[1]; // Extract the token from the Authorization header

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ message: "Not Logged In!" }); // Return a 401 status and a message if the token is not found
  }

  // Verify the token with the access token secret
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    // Check for any errors during token verification
    if (error) {
      return res.status(403).json({ message: "Invalid Token!" }); // Return a 403 status and a message if the token is invalid
    }

    // If the token is valid, set the user email in the request object and call the next middleware
    req.user = {
      email: user.email, // Set the user email in the request object
    };
    
    next(); // Call the next middleware in the request cycle
  });
};

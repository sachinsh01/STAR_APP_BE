// Check if the environment is not in production and load the environment variables
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config(); // Load the environment variables from the .env file
}

const mongoose = require("mongoose"); // Import the mongoose library for interacting with MongoDB

const dbURL = process.env.DB_URL; // Get the database URL from the environment variables
const dbLocal = 'mongodb://localhost:27017/STAR-APP'; // Define a local database URL

// Connect to the MongoDB database using Mongoose
mongoose.connect(dbURL).then(() => {
    console.log("Connected to database through mongoose."); // Log a message indicating successful connection to the database
});
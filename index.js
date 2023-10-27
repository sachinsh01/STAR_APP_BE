// Import required packages and modules
const express = require("express"); // Import the express framework
const cookieParser = require("cookie-parser"); // Import the cookie-parser middleware
const cors = require("cors"); // Import the cors middleware for handling Cross-Origin Resource Sharing
const routes = require("./routes"); // Import the routes module
const Port = 4000; // Define the port number on which the server will run

// Establish connection to MongoDB
require("./mongoconnection"); // Import and execute the code for establishing a connection to MongoDB

// Create an instance of the Express server
const server = express();

// Use the cookie-parser middleware
server.use(cookieParser());

// Enable Cross-Origin Resource Sharing (CORS) for the server
server.use(cors());

// Parse incoming requests with JSON payloads
server.use(express.json());

// Use the defined routes for the server
server.use(routes);

// Start the server and listen on the specified port
server.listen(Port, function() {
    console.log("Server is running on port", Port); // Print a message indicating that the server is running and listening on the specified port
});
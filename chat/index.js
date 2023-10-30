// Import the express module
const express = require("express");

// Import the ChatController module to handle chat-related requests
const ChatController = require("./chat.controller");

// Import the middleware module to check authentication
const middlewares = require("../middlewares/checkAuth");

// Create a new router instance from the express module
const router = express.Router();

// Handle the POST request for the chat endpoint using the chatResponse function from the ChatController
router.post("/", ChatController.chatResponse);

// Export the router to make it accessible to other parts of the application
module.exports = router;

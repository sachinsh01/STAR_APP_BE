// Import the express module
const express = require("express");

// Import the AnalyticsController and middlewares
const AnalyticsController = require("./analytics.controller");
const middlewares = require("../middlewares/checkAuth");

// Create a router instance
const router = express.Router();

// Define various routes for analytics-related operations
router.get("/timesheets-filled", AnalyticsController.timesheetsFilled); // Get analytics about the timesheets filled
router.get("/tickets", AnalyticsController.ticketsStats); // Get analytics about the tickets
router.get("/vertical-time", AnalyticsController.verticalWiseTime); // Get analytics about the tickets


// Export the router to be used in other parts of the application
module.exports = router;
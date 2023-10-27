// Import the express module
const express = require("express");

// Import the AnalyticsController and middlewares
const AnalyticsController = require("./analytics.controller");
const middlewares = require("../middlewares/checkAuth");

// Create a router instance
const router = express.Router();

// Define various routes for analytics-related operations
router.get("/getDataforPlotting", AnalyticsController.getDataforPlotting); //Get data related to total billable, nonbillable hours and expected hours
router.get("/getDataOfProjects", AnalyticsController.getDataOfProjects); //Get data of all projects to plot graph
router.get("/getDataOfManagers", AnalyticsController.getDataOfManagers); //Get data of all managers to plot graph
router.get("/timesheets-filled", AnalyticsController.timesheetsFilled); // Get analytics about the timesheets filled
router.get("/tickets", AnalyticsController.ticketsStats); // Get analytics about the tickets
router.get("/vertical-time", AnalyticsController.verticalWiseTime); // Get analytics about the tickets

// Export the router to be used in other parts of the application
module.exports = router;

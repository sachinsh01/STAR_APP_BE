const express = require("express"); // Import the Express framework

const router = express.Router(); // Create an instance of an Express router

// Define different routes for different functionalities
router.use("/user", require("./user")); // Mount the user routes from the user router
router.use("/ticket", require("./ticket")); // Mount the ticket routes from the ticket router
router.use("/project", require("./project")); // Mount the project routes from the project router
router.use("/timesheet", require("./timesheet")); // Mount the timesheet routes from the timesheet router
router.use("/analytics", require("./analytics")); // Mount the analytics routes from the analytics router
router.use("/chat", require("./chat")); // Mount the chat routes from the chat router
router.use("/holidays", require('./holidays')) //Mount the holidays routes from the holidays router

module.exports = router; // Export the router to be used in other parts of the application
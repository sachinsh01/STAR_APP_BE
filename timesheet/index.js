const express = require("express");
const TimesheetController = require("./timesheet.controller");
const middlewares = require("../middlewares/checkAuth");

const router = express.Router();

router.get("/", middlewares.checkAuth, TimesheetController.getTimesheets); // Route to get timesheets
router.get("/manager", middlewares.checkAuth, TimesheetController.managerTimesheets); // Route to get timesheets for a manager
router.post("/status", middlewares.checkAuth, TimesheetController.changeStatus); // Route to change timesheet status
router.post("/updateAll", middlewares.checkAuth, TimesheetController.updateAll); // Route to change all timesheets status
router.post("/getAttendance", middlewares.checkAuth, TimesheetController.getAttendance); // Route to get attendance
router.post("/saveAttendance", middlewares.checkAuth, TimesheetController.saveAttendance); // Route to save attendance
router.post("/submitTimesheet", middlewares.checkAuth, TimesheetController.submitTimesheet); // Route to submit timesheet
router.delete("/", middlewares.checkAuth, TimesheetController.deleteTimesheet);// Route to delete a timesheet

module.exports = router;

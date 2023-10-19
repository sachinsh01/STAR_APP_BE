var express = require("express");
var TimesheetController = require("./timesheet.controller");
const middlewares = require("../middlewares/checkAuth");

var router = express.Router();

router.get("/holidays", TimesheetController.holidays)
router.get("/", middlewares.checkAuth, TimesheetController.getTimesheets);
router.get("/manager", middlewares.checkAuth, TimesheetController.managerTimesheets);
router.post("/status", middlewares.checkAuth, TimesheetController.changeStatus);
router.post("/getAttendance", middlewares.checkAuth, TimesheetController.getAttendance);
router.post("/saveAttendance", middlewares.checkAuth, TimesheetController.saveAttendance);
router.post("/submitTimesheet", middlewares.checkAuth, TimesheetController.submitTimesheet);
router.delete("/", middlewares.checkAuth, TimesheetController.deleteTimesheet);


module.exports = router;

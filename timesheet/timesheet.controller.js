const AttendanceModel = require("../models/attendance");
const TimesheetModel = require("../models/timesheet");
const moment = require('moment');

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

exports.getDates = async function(req, res) {


}

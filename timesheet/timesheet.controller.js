const AttendanceModel = require("../models/attendance");
const TimesheetModel = require("../models/timesheet");
var UserModel = require("../models/user");
var ProjectModel = require("../models/project");
var ResourceMapModel = require("../models/resourceMap");
const moment = require('moment');

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

exports.getAttendance = async function (req, res) {
  const user = await UserModel.findOne({ email: req.user.email });
  const resourceMap = await ResourceMapModel.find({ resourceID: user._id });
  const projectIDs = resourceMap.map((object) => object.projectID);

  const query = {
    resourceID: user._id,
    date: req.body.date
  }

  await AttendanceModel.find(query).then((data) => {
    res.send(data)
  })
}

exports.saveAttendance = async function (req, res) {
  const user = await UserModel.findOne({ email: req.user.email });
  let success = true;

  for (const key in req.body.hours) {

    const hours = req.body.hours[key].map((value) => (value === "" ? 0 : value));

    await AttendanceModel.deleteOne({
      resourceID: user._id,
      projectID: key,
      date: req.body.weekStartDate
    })

    var attendanceData = new AttendanceModel({
      resourceID: user._id,
      projectID: key,
      date: req.body.weekStartDate,
      hours: hours
    })

    attendanceData.save().then((data) => {
      console.log("Following data saved: ", data)
    }, (error) => {
      console.log("Error While Saving the Data", error);
      success = false
    })
  }

  if (success) {
    res.send({
      message: "Data Saved Successfully!"
    })
  } else {
    res.send({
      message: "Internal Server Error!"
    })
  }
}

exports.submitTimesheet = async function (req, res) {
  const user = await UserModel.findOne({ email: req.user.email });
  let success = true

  for (const key in req.body.hours) {

    const hours = req.body.hours[key].map((value) => (value === "" ? 0 : value));

    await AttendanceModel.deleteOne({
      resourceID: user._id,
      projectID: key,
      date: req.body.weekStartDate
    })

    var attendanceData = new AttendanceModel({
      resourceID: user._id,
      projectID: key,
      date: req.body.weekStartDate,
      hours: hours
    })

    attendanceData.save().then((data) => {
      console.log("Following data saved: ", data)

      var timesheetData = new TimesheetModel({
        resourceID: user._id,
        projectID: key,
        startDate: req.body.weekStartDate,
        endDate: moment(req.body.weekStartDate).add(7, "days"),
        totalHours: Array.isArray(hours) ? hours : Array(7).fill(0),
        comment: req.body.comment,
        submissionDate: moment(),
        approvalDate: "",
        status: "Pending",
        remarks: ""
      })

      timesheetData.save().then((data) => {
        console.log("Following timesheet created: ", data)
      }, (error) => {
        console.log("Error While Submiting the Data", error);
        success = false
      })
    }, (error) => {
      console.log("Error While Saving the Data", error);
      success = false
    })
  }

  if (success) {
    res.send({
      message: "Data Submitted Successfully!"
    })
  } else {
    res.send({
      message: "Internal Server Error!"
    })
  }
}

exports.getTimesheets = async function (req, res) {
  const user = await UserModel.findOne({ email: req.user.email });

  try {
    const timesheets = await Promise.all(
      (await TimesheetModel.find({ resourceID: user._id })).map(async (item) => {
        const project = await ProjectModel.findOne({ _id: item.projectID });
        return {
          ...item.toObject(), // Convert Mongoose document to plain JavaScript object
          projectName: project.projectName
        };
      })
    );

    res.send({ timesheets });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error!" });
  }
}

exports.deleteTimesheet = async function (req, res) {
  const user = await UserModel.findOne({ email: req.user.email });
  
  await TimesheetModel.deleteOne({_id: req.body._id}).then((data) => {
    res.send({message: "Timesheet Deleted!"})
  }, (error) => {
    console.log("Error", error)
    res.send("Internal Server Error!")
  })
}
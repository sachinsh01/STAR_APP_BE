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

exports.managerTimesheets = async function (req, res) {
  try {
    const user = await UserModel.findOne({ email: req.user.email });
    const projects = await ProjectModel.find({ managerID: user._id });

    const timesheetsWithDetails = [];

    for (const project of projects) {
      const timesheets = await TimesheetModel.find({ projectID: project._id });

      for (const timesheet of timesheets) {
        const resource = await UserModel.findOne({ _id: timesheet.resourceID });
        const resourceMap = await ResourceMapModel.findOne({
          resourceID: timesheet.resourceID,
          projectID: project._id,
        });

        timesheetsWithDetails.push({
          ...timesheet.toObject(), // Convert to plain object
          projectName: project.projectName, // Add projectName field
          expectedHours: resourceMap.expectedHours, // Add expectedHours from resourceMap
          isClientBillable: resourceMap.isClientBillable, // Add isClientBillable from resourceMap
          name: resource.name, // Add name from user
          designation: resource.designation, // Add designation from user
          image: resource.image, // Add image from user
        });
      }
    }

    // Assuming 'timesheetsWithDetails' is your array of timesheet objects with added fields
    timesheetsWithDetails.sort((a, b) => {
      // Parse the 'startDate' strings into Date objects
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);

      // Compare the dates in descending order (latest date first)
      return dateB - dateA;
    });

    res.json({ timesheets: timesheetsWithDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

exports.changeStatus = async function (req, res) {
  await TimesheetModel.findOneAndUpdate({ _id: req.body.ID }, { status: req.body.status }).then((data) => {
    console.log("Status Updated!", data);
    res.send({
      message: "Status updated!"
    })
  }, (error) => {
    console.log("Error: ", error);
    res.send({
      message: "Internal Server Error!"
    })
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

    // Assuming 'timesheets' is your array of timesheet objects
    timesheets.sort((a, b) => {
      // Parse the 'startDate' strings into Date objects
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);

      // Compare the dates in descending order (latest date first)
      return dateB - dateA;
    });


    res.send({ timesheets });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error!" });
  }
}

exports.deleteTimesheet = async function (req, res) {
  const user = await UserModel.findOne({ email: req.user.email });

  await TimesheetModel.deleteOne({ _id: req.body._id }).then((data) => {
    res.send({ message: "Timesheet Deleted!" })
  }, (error) => {
    console.log("Error", error)
    res.send("Internal Server Error!")
  })
}
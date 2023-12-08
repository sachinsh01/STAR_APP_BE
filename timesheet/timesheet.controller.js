// Import necessary models and libraries
const AttendanceModel = require("../models/attendance");
const TimesheetModel = require("../models/timesheet");
const UserModel = require("../models/user");
const ProjectModel = require("../models/project");
const ResourceMapModel = require("../models/resourceMap");
const mailer = require("../helpers/mailer");
const moment = require("moment");

// Load environment variables if not in production mode
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Function to retrieve user attendance data based on the provided date
exports.getAttendance = async function (req, res) {
  // Retrieve user data based on the provided user email
  const user = await UserModel.findOne({ email: req.user.email });
  // Find resource mappings for the user to determine corresponding project IDs
  const resourceMap = await ResourceMapModel.find({ resourceID: user._id });

  // Create a query object using the user ID and the provided date
  const query = {
    resourceID: user._id,
    date: req.body.date,
  };

  // Use the AttendanceModel to find attendance data based on the constructed query
  await AttendanceModel.find(query).then((data) => {
    // Send the retrieved data as the response
    res.send(data);
  });
};

exports.managerTimesheets = async function (req, res) {
  try {
    // Find the user based on the provided email
    const user = await UserModel.findOne({ email: req.user.email });

    // Find projects managed by the user
    const projects = await ProjectModel.find({ managerID: user._id });

    const timesheetsWithDetails = [];

    for (const project of projects) {
      // Find timesheets associated with the project
      const timesheets = await TimesheetModel.find({ projectID: project._id });

      for (const timesheet of timesheets) {
        // Find the resource associated with the timesheet
        const resource = await UserModel.findOne({ _id: timesheet.resourceID });

        // Push the timesheet details along with additional fields to the 'timesheetsWithDetails' array
        timesheetsWithDetails.push({
          ...timesheet.toObject(), // Convert to plain object
          projectName: project.projectName, // Add projectName field
          expectedHours: timesheet.expectedHours, // Add expectedHours
          name: resource.name, // Add name from user
          designation: resource.designation, // Add designation from user
          image: resource.image, // Add image from user
        });
      }
    }

    // Sort the timesheets in descending order based on the 'startDate' field
    timesheetsWithDetails.sort((a, b) => {
      // Parse the 'startDate' strings into Date objects
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);

      // Compare the dates in descending order (latest date first)
      return dateB - dateA;
    });

    // Send the sorted timesheet details in the response
    res.json({ timesheets: timesheetsWithDetails });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

//Changes the status and remarks of a timesheet based on the provided ID.
exports.changeStatus = async function (req, res) {
  await TimesheetModel.findOneAndUpdate(
    { _id: req.body.ID }, // Find the timesheet by its ID
    {
      status: req.body.status,
      remarks: req.body.remarks,
      approvalDate: moment(),
    } // Update the status and remarks
  ).then(
    (data) => {
      // If the operation is successful
      console.log("Status Updated!", data);

      if (req.body.status == "Rejected") {
        AttendanceModel.findOneAndUpdate(
          {
            resourceID: req.body.sheet.resourceID,
            projectID: req.body.sheet.projectID,
            date: req.body.sheet.startDate,
          },
          { isSubmitted: false }
        );
      }

      res.send({
        message: "Action Performed!", // Send a success message
      });
    },
    (error) => {
      // If an error occurs during the operation
      console.log("Error: ", error);
      res.send({
        message: "Internal Server Error!", // Send an error message
      });
    }
  );
};

//Saves attendance data for a user based on the provided input.
exports.saveAttendance = async function (req, res) {
  const user = await UserModel.findOne({ email: req.user.email });
  let success = true;

  for (const key in req.body.hours) {
    const hours = req.body.hours[key].map((value) =>
      value === "" ? 0 : value
    );

    // Check if attendance data exists for the user, project, and date
    const attendance = await AttendanceModel.findOne({
      resourceID: user._id,
      projectID: key,
      date: req.body.weekStartDate,
    });

    // Handle scenarios based on existing attendance data
    if (attendance) {
      if (attendance.isSubmitted) {
        return res.send({
          message: "Cannot Save! Timesheet Already Submitted.",
          error: true,
        });
      } else {
        // Delete any existing attendance data for the user and project on the specified date
        await AttendanceModel.deleteOne({
          resourceID: user._id,
          projectID: key,
          date: req.body.weekStartDate,
        });
      }
    }

    // Create and save new attendance data
    const attendanceData = new AttendanceModel({
      resourceID: user._id,
      projectID: key,
      date: req.body.weekStartDate,
      hours: hours,
      isSubmitted: false,
    });

    attendanceData.save().then(
      (data) => {
        console.log("Following data saved: ", data);
      },
      (error) => {
        console.log("Error While Saving the Data", error);
        success = false;
      }
    );
  }

  if (success) {
    res.send({
      message: "Data Saved Successfully!",
    });
  } else {
    res.send({
      message: "Internal Server Error!",
    });
  }
};

//Submits timesheet data for a user, including attendance data and relevant details.
exports.submitTimesheet = async function (req, res) {
  const user = await UserModel.findOne({ email: req.user.email });
  let success = true;

  for (const key in req.body.hours) {
    const hours = req.body.hours[key].map((value) =>
      value === "" ? 0 : value
    );

    // Check if attendance data exists for the user, project, and date
    const attendance = await AttendanceModel.findOne({
      resourceID: user._id,
      projectID: key,
      date: req.body.weekStartDate,
    });

    // Handle scenarios based on existing attendance data
    if (attendance) {
      if (attendance.isSubmitted) {
        return res.send({
          message: "Already submitted timesheet for this week",
          error: true,
        });
      } else {
        await AttendanceModel.deleteOne({
          resourceID: user._id,
          projectID: key,
          date: req.body.weekStartDate,
        });
      }
    }

    // Fetch resource map data for the user and project
    const query = {
      projectID: key,
      resourceID: user._id,
    };

    const resourceMap = await ResourceMapModel.findOne(query);

    let expectedHours = null;
    let autoApprove = true;

    if (resourceMap) {
      expectedHours = resourceMap.expectedHours;
    }

    // Compare hours with expected hours to determine auto-approval status
    for (let i = 0; i < hours.length - 2; i++) {
      if (hours[i] != expectedHours / 5) {
        autoApprove = false;
      }
    }

    // Save attendance data and create a new timesheet
    const attendanceData = new AttendanceModel({
      resourceID: user._id,
      projectID: key,
      date: req.body.weekStartDate,
      hours: hours,
      isSubmitted: true,
    });

    attendanceData.save().then(
      (data) => {
        console.log("Following data saved: ", data);

        const timesheetData = new TimesheetModel({
          resourceID: user._id,
          projectID: key,
          startDate: req.body.weekStartDate,
          endDate: moment(req.body.weekStartDate).add(7, "days"),
          totalHours: Array.isArray(hours) ? hours : Array(7).fill(0),
          comment: req.body.comment,
          submissionDate: moment(),
          approvalDate: "",
          status: autoApprove ? "Auto-Approved" : "Pending",
          remarks: "",
          expectedHours: expectedHours, // Add expectedHours to the timesheet
        });

        timesheetData.save().then(
          (data) => {
            mailer.timesheetEmail(user, data); // Send email notification for the timesheet
            console.log("Following timesheet created: ", data);
          },
          (error) => {
            console.log("Error While Submitting the Data", error);
            success = false;
          }
        );
      },
      (error) => {
        console.log("Error While Saving the Data", error);
        success = false;
      }
    );
  }

  // Respond with appropriate messages based on the success status
  if (success) {
    res.send({
      message: "Data Submitted Successfully!",
    });
  } else {
    res.send({
      message: "Internal Server Error!",
    });
  }
};

//Retrieves timesheets for the currently authenticated user.
//This function fetches timesheet data and the corresponding project names.
exports.getTimesheets = async function (req, res) {
  // Find the user based on the provided email from the request
  const user = await UserModel.findOne({ email: req.user.email });

  try {
    // Fetch timesheets for the user and map them to include project names
    const timesheets = await Promise.all(
      (
        await TimesheetModel.find({ resourceID: user._id })
      ).map(async (item) => {
        const project = await ProjectModel.findOne({ _id: item.projectID });
        return {
          ...item.toObject(), // Convert Mongoose document to plain JavaScript object
          projectName: project.projectName,
        };
      })
    );

    // Sort timesheets in descending order by startDate
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
};

//Deletes a timesheet and its associated attendance data.
exports.deleteTimesheet = async function (req, res) {
  try {
    // Find the timesheet data to be deleted
    const timesheetData = await TimesheetModel.findOne({ _id: req.body._id });

    // Check if the timesheet data exists
    if (!timesheetData) {
      return res.status(404).send({ message: "Timesheet not found!" });
    }

    // Delete the timesheet data
    await TimesheetModel.deleteOne({ _id: req.body._id });

    // Find and delete associated attendance data
    const attendanceData = await AttendanceModel.findOneAndDelete({
      resourceID: timesheetData.resourceID,
      projectID: timesheetData.projectID,
      date: timesheetData.startDate,
    });

    // Check if attendance data exists
    if (!attendanceData) {
      return res.send({ message: "Attendance not found!" });
    }

    res.send({ message: "Timesheet and Attendance Deleted!" });
  } catch (error) {
    console.log("Error", error);
    res.status(500).send("Internal Server Error!");
  }
};
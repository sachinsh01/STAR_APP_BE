// Import necessary models and libraries
const UserModel = require("../models/user");
const ProjectModel = require("../models/project");
const ResourceMapModel = require("../models/resourceMap");
const AttendanceModel = require("../models/attendance");
const TimesheetModel = require("../models/timesheet");
const TicketModel = require("../models/ticket")
const moment = require('moment');

exports.timesheetsFilled = async function (req, res) {
    // Retrieve all timesheets from the database
    const timesheets = await TimesheetModel.find({});

    // Initialize counters for timesheets filled on or before the end date and timesheets filled after the end date
    let filledOnOrBeforeEndDate = 0;
    let filledAfterEndDate = 0;

    // Iterate through each timesheet to categorize them based on the submission date and end date
    timesheets.forEach((timesheet) => {
        const { submissionDate, endDate } = timesheet;

        // Check if both submission date and end date exist
        if (submissionDate && endDate) {
            // Convert submission date and end date to Date objects for comparison
            const submissionDateTime = new Date(submissionDate);
            const endDateTime = new Date(endDate);

            // Compare submission date and end date to determine their classification
            if (submissionDateTime <= endDateTime) {
                // Increment the counter for timesheets filled on or before the end date
                filledOnOrBeforeEndDate++;
            } else {
                // Increment the counter for timesheets filled after the end date
                filledAfterEndDate++;
            }
        }
    });

    // Calculate the total number of timesheets
    const totalTimesheets = filledOnOrBeforeEndDate + filledAfterEndDate;

    // Calculate the percentages of timesheets filled on time and not on time
    const onTimePercentage = ((filledOnOrBeforeEndDate / totalTimesheets) * 100).toFixed(2);
    const notOnTimePercentage = ((filledAfterEndDate / totalTimesheets) * 100).toFixed(2);

    // Send the results as a response to the request
    res.send({
        labels: ["On-Time", "Not On-Time"],
        data: [onTimePercentage, notOnTimePercentage]
    });
}

// Function to compute the percentage of tickets that are closed and those that are open
exports.ticketsStats = async function (req, res) {
    // Retrieve all tickets from the database
    const tickets = await TicketModel.find({});

    // Initialize counters for open and closed tickets
    let openTickets = 0;
    let closedTickets = 0;

    // Iterate through each ticket to categorize them based on their status
    tickets.forEach((ticket) => {
        const { status } = ticket;

        // Check the status of the ticket to determine whether it is open or closed
        if (status === "Closed" || status === "Rejected") {
            // Increment the counter for closed tickets
            closedTickets++;
        } else {
            // Increment the counter for open tickets
            openTickets++;
        }
    });

    // Compute the total number of tickets
    const totalTickets = openTickets + closedTickets;

    // Compute the percentage of closed and open tickets
    const percentClosed = (closedTickets / totalTickets) * 100;
    const percentOpen = (openTickets / totalTickets) * 100;

    // Send the results as a response to the request
    res.send({
        labels: ["Open", "Closed"],
        data:[percentOpen, percentClosed]
    });
}

// Function to calculate the percentage of timesheets greater and smaller than expected hours in each vertical
exports.verticalWiseTime = async function (req, res) {
    const verticals = ["Telecom", "Product Engineering", "Wealth Management", "Banking", "Life Sciences"];

    const result = {
        labels: verticals,
        greaterThanExpected: [],
        smallerThanExpected: []
    };

    // Iterate through each vertical
    for (const vertical of verticals) {
        // Find all project IDs for the current vertical
        const projectIDs = await ProjectModel.find({ vertical: vertical }, { _id: 1 });

        let totalTimesheets = 0;
        let greaterCount = 0;
        let smallerCount = 0;

        // Iterate through each project ID
        for (const project of projectIDs) {
            // Find all timesheets for the current project ID
            const timesheets = await TimesheetModel.find({ projectID: project._id });

            // Update total timesheets
            totalTimesheets += timesheets.length;

            // Iterate through each timesheet
            for (const timesheet of timesheets) {
                // Calculate the sum of total hours
                const totalHoursSum = timesheet.totalHours.reduce((a, b) => a + b, 0);

                // Compare the sum with expected hours
                if (totalHoursSum > timesheet.expectedHours) {
                    greaterCount++;
                } else if (totalHoursSum < timesheet.expectedHours) {
                    smallerCount++;
                }
            }
        }

        // Calculate percentages
        const greaterPercentage = (greaterCount / totalTimesheets) * 100;
        const smallerPercentage = (smallerCount / totalTimesheets) * 100;

        // Store the percentages in the result object
        result.greaterThanExpected.push(greaterPercentage);
        result.smallerThanExpected.push(smallerPercentage);
    }

    // Return the result object
    res.json(result);
};

// Projects data for plotting
exports.getDataOfProjects = async function (req, res) {
    try {
      //find all the projects
      const projects = await ProjectModel.find({}, "id projectName");
  
      // map project id to project names
      const projectArray = projects.reduce((result, project) => {
        result[project.id] = {
          projectName: project.projectName,
          projectObjectId: project._id,
          hours: 0,
          expectedHours: 0,
        };
        return result;
      }, {});
  
      const projectHours = {};
  
      for (let projectId in projectArray) {
        const timesheets = await TimesheetModel.find({
          projectID: projectArray[projectId].projectObjectId,
        });
  
        const totalHours = timesheets.reduce((hours, timesheet) => {
          return hours + timesheet.totalHours.reduce((a, b) => a + b, 0);
        }, 0);
  
        //find the expected hours from each resourcemap
        let totalExpectedHours = 0;
  
        for (const timesheet of timesheets) {
          const resourceMap = await ResourceMapModel.find({
            resourceID: timesheet.resourceID,
            projectID: timesheet.projectID,
          });
          totalExpectedHours += resourceMap.reduce(
            (a, b) => a + b.expectedHours,
            0
          );
        }
  
        projectArray[projectId].hours = totalHours;
        projectArray[projectId].expectedHours = totalExpectedHours;
      }
  
      //send required data for plotting
      res.send({ projectArray });
    } catch (error) {
      console.log("error -> ", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  };
  
  // Project Managers data for plotting
exports.getDataOfManagers = async function (req, res) {
    try {
      //all managers
      const managers = await ProjectModel.distinct("managerID");
  
      const managersData = {};
  
      for (const managerID of managers) {
        // all projects under a manager
        const projects = await ProjectModel.find({ managerID });
        const manager = await UserModel.findOne({ _id: managerID });
  
        const projectIDsData = projects.map((project) => {
          return {
            projectObjectId: project._id,
            projectId: project.id,
            projectName: project.projectName,
            managerId: managerID,
          };
        });
  
        let totalHours = 0;
        let totalExpectedHours = 0;
  
        for (const projectData of projectIDsData) {
          const projectObjectId = projectData.projectObjectId;
  
          // find hours from each timesheet in each project under a manager
          const timesheets = await TimesheetModel.find({
            projectID: projectObjectId,
          });
  
          const hoursInOneProject = timesheets.reduce((hours, timesheet) => {
            return hours + timesheet.totalHours.reduce((a, b) => a + b, 0);
          }, 0);
  
          totalHours += hoursInOneProject;
  
          //find the expected hours from each resourcemap
          for (const timesheet of timesheets) {
            const resourceMap = await ResourceMapModel.find({
              resourceID: timesheet.resourceID,
              projectID: timesheet.projectID,
            });
            totalExpectedHours += resourceMap.reduce(
              (a, b) => a + b.expectedHours,
              0
            );
          }
        }
        
        //format the data to be ordered
        managersData[managerID] = {
          manager: manager.name,
          projectName: projectIDsData
            .filter((projectData) => projectData.managerId === managerID)
            .map((projectData) => projectData.projectName),
          hours: totalHours,
          expectedHours: totalExpectedHours,
        };
      }
  
      res.send({ managersData });
    } catch (error) {
      console.log("error", error);
      res.send({ error: error });
    }
  };

//   Get billable, non-billable and expected hours data
  exports.getDataforPlotting = async function (req, res) {
    try {
        // fetch all the timesheets
      const timesheets = await TimesheetModel.find({});
      const result = {};
  
      for (const timesheet of timesheets) {
        //find corresponding projectID and resourceID
        const projectID = timesheet.projectID;
        const resourceID = timesheet.resourceID;
  
        const project = await ProjectModel.findById(projectID).exec();
  
        if (!project) continue;
  
        const vertical = project.vertical;
  
        const resourceMap = await ResourceMapModel.findOne({
          projectID,
          resourceID,
        }).exec();
        const expectedHours = resourceMap ? resourceMap.expectedHours : 0;
        // check whether billable or not (default non-billable)
        const isBillable =
          resourceMap && resourceMap.isClientBillable
            ? resourceMap.isClientBillable.billable
            : false;
        const from = resourceMap.isClientBillable.from;
        const till = resourceMap.isClientBillable.till;
  
        let billableHours = 0;
        let nonBillableHours = 0;
        
        for (let i = 0; i < timesheet.totalHours.length; i++) {
          const currentDate = timesheet.startDate;
          currentDate.setDate(currentDate.getDate() + i);
  
          if (!from) {                                    //if from date non given then hours are non-billable
            nonBillableHours += timesheet.totalHours[i];
          } else if (from && !till) {                     // if from data is given then hours are billable
            billableHours += timesheet.totalHours[i];
          } else if (from && till) {
            if (currentDate >= from && currentDate <= till) {
              billableHours += timesheet.totalHours[i];
            } else {
              nonBillableHours += timesheet.totalHours[i];
            }
          }
        }
  
        const hours = {
          billableHours,
          nonBillableHours,
        };
  
        if (isBillable === false) {
          hours.nonBillableHours += hours.billableHours;
          hours.billableHours = 0;
        }
        //format data in ordered form
        if (!result[vertical]) {
          result[vertical] = hours;
          result[vertical].expectedHours = 0;
        } else {
          result[vertical].billableHours += hours.billableHours;
          result[vertical].nonBillableHours += hours.nonBillableHours;
        }
  
        result[vertical].expectedHours += expectedHours;
      }
  
      res.send(result);
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  };
  
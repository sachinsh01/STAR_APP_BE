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
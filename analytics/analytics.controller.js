// Import necessary models and libraries
const UserModel = require("../models/user");
const ProjectModel = require("../models/project");
const ResourceMapModel = require("../models/resourceMap");
const AttendanceModel = require("../models/attendance");
const TimesheetModel = require("../models/timesheet");
const TicketModel = require("../models/ticket")
const moment = require('moment');

// Function to compute the number of timesheets filled on or before the end date and the number of timesheets filled after the end date
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

    // Send the results as a response to the request
    res.send({
        filledOnOrBeforeEndDate,
        filledAfterEndDate
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
        percentClosed,
        percentOpen
    });
}


// Import the Mongoose module
const Mongoose = require("mongoose");

// Define the schema for the Timesheet model
const TimesheetSchema = new Mongoose.Schema({
    resourceID: { // Reference to the User model through ObjectID, indicating the resource associated with the timesheet
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    projectID: { // Reference to the Project model through ObjectID, indicating the project related to the timesheet
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    startDate: { // Start date of the timesheet
        type: Date,
    },
    endDate: { // End date of the timesheet
        type: Date,
    },
    totalHours: { // Array of numbers representing the total hours worked for each day
        type: [Number]
    },
    expectedHours: { // Expected number of hours for the timesheet
        type: Number,
    },
    shift: { // Shift information of the user
        type: String,
    },
    comment: { // Additional comments related to the timesheet
        type: String
    },
    submissionDate: { // Date of submission of the timesheet
        type: Date
    },
    approvalDate: { // Date of approval of the timesheet
        type: Date
    },
    status: { // Current status of the timesheet
        type: String
    },
    remarks: { // Remarks related to the timesheet
        type: String
    }
});

// Create the Timesheet model based on the defined schema
const TimesheetModel = Mongoose.model("Timesheet", TimesheetSchema);

// Export the Timesheet model for use in other parts of the application
module.exports = TimesheetModel;
var Mongoose = require("mongoose");

var TimesheetSchema = new Mongoose.Schema({
    resourceID: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    projectID: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    totalHours: {
        type: Number
    },
    comment: {
        type: String
    },
    submissionDate: {
        type: Date
    },
    approvalDate: {
        type: Date
    },
    status: {
        type: String
    },
    remarks: {
        type: String
    }
});

var TimesheetModel = Mongoose.model("Timesheet", TimesheetSchema);

module.exports = TimesheetModel
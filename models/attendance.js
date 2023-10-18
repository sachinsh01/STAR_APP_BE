// Import the Mongoose module
const Mongoose = require("mongoose");

// Define the schema for the Attendance model
const AttendanceSchema = new Mongoose.Schema({
    resourceID: { // Reference to the User model using ObjectID
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    projectID: { // Reference to the Project model using ObjectID
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    date: { // Date field for storing the date of attendance
        type: Date
    },
    hours: { // Array of numbers for storing hours worked
        type: [Number]
    },
    isSubmitted: { // Boolean field to indicate if the attendance is submitted
        type: Boolean
    }
});

// Create the Attendance model based on the defined schema
const AttendanceModel = Mongoose.model("Attendance", AttendanceSchema);

// Export the Attendance model
module.exports = AttendanceModel;
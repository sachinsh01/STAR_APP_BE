var Mongoose = require("mongoose");

var AttendanceSchema = new Mongoose.Schema({
    resourceID: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    projectID: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    date: {
        type: Date
    },
    hours: {
        type: [Number]
    }
});

var AttendanceModel = Mongoose.model("Attendance", AttendanceSchema);

module.exports = AttendanceModel
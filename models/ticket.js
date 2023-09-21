var Mongoose = require("mongoose");

var TicketSchema = new Mongoose.Schema({
    userID: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    managerID: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    projectID: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    subject: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String
    },
    isElevated: {
        type: Boolean
    },
    remarks: {
        type: String
    }
});

var TicketModel = Mongoose.model("Ticket", TicketSchema);

module.exports = TicketModel
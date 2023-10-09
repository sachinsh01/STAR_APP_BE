var Mongoose = require("mongoose");

var TicketSchema = new Mongoose.Schema({
    raisedFrom: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    raisedTo: {
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
    category: {
        type: String
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
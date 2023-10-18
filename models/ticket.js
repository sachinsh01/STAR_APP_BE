// Import the Mongoose module
const Mongoose = require("mongoose");

// Define the schema for the Ticket model
const TicketSchema = new Mongoose.Schema({
    raisedFrom: { // Reference to the User model through ObjectID, indicating the user who raised the ticket
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    raisedTo: { // Reference to the User model through ObjectID, indicating the user to whom the ticket is raised
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    projectID: { // Reference to the Project model through ObjectID, indicating the project related to the ticket
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    subject: { // Subject of the ticket, required field
        type: String,
        required: true
    },
    category: { // Category of the ticket
        type: String
    },
    description: { // Description of the ticket, required field
        type: String,
        required: true
    },
    status: { // Current status of the ticket
        type: String
    },
    isElevated: { // Indicates whether the ticket is elevated or not
        type: Boolean
    },
    remarks: { // Remarks related to the ticket
        type: String
    }
});

// Create the Ticket model based on the defined schema
const TicketModel = Mongoose.model("Ticket", TicketSchema);

// Export the Ticket model for use in other parts of the application
module.exports = TicketModel;
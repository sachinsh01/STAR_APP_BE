// Import the Mongoose module
const Mongoose = require("mongoose");

// Define the schema for the ResourceMap model
const ResourceMapSchema = new Mongoose.Schema({
    projectID: { // Reference to the Project model through ObjectID
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    resourceID: { // Reference to the User model through ObjectID
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    expectedHours: { // Number of expected hours for the resource
        type: Number,
    },
    description: { // Description of the resource mapping
        type: String,
    },
    isClientBillable: { // Specifies whether the resource is client billable or not and from what date
        billable: Boolean, // Boolean value indicating whether the client is billable
        from: Date // Date from which the resource is client billable
    }
});

// Create the ResourceMap model based on the defined schema
const ResourceMapModel = Mongoose.model("ResourceMap", ResourceMapSchema);

// Export the ResourceMap model for use in other parts of the application
module.exports = ResourceMapModel;

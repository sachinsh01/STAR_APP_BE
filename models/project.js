// Import the Mongoose module
const Mongoose = require("mongoose");

// Define the schema for the Project model
const ProjectSchema = new Mongoose.Schema({
  id: { // Unique identifier for the project
    type: String
  },
  projectName: { // Name of the project (required field)
    type: String,
    required: true,
  },
  description: { // Description of the project
    type: String,
  },
  vertical: { // Vertical category of the project
    type: String,
  },
  horizontal: { // Horizontal category of the project
    type: String,
  },
  subHorizontal: { // Sub-horizontal category of the project
    type: String,
  },
  customerName: { // Name of the customer associated with the project
    type: String,
  },
  customerID: { // ID of the customer associated with the project
    type: String,
  },
  managerID: { // Reference to the User model through ObjectID for the project manager
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// Create the Project model based on the defined schema
const ProjectModel = Mongoose.model("Project", ProjectSchema);

// Export the Project model for use in other parts of the application
module.exports = ProjectModel;
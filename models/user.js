// Import the Mongoose module
const Mongoose = require("mongoose");

// Define the schema for the User model
const UserSchema = new Mongoose.Schema({
  id: {
    // Unique identifier for the user
    type: String,
  },
  name: {
    // Name of the user
    type: String,
    required: true,
    unique: false,
  },
  email: {
    // Email address of the user
    type: String,
    required: true,
    unique: true,
  },
  password: {
    // Password of the user
    type: String,
    required: true,
  },
  designation: {
    // Designation or role of the user
    type: String,
  },
  image: {
    // Image information of the user
    url: String, // URL of the user's image
    filename: String, // Filename of the user's image
  },
  shift: { // Shift information of the user
    type: String,
  },
  isAdmin: { // Boolean indicating whether the user has admin privileges

    type: Boolean,
  },
  locations: {
    type: Map,
    of: [String],
  },
});

// Create the User model based on the defined schema
const UserModel = Mongoose.model("User", UserSchema); // 'User' refers to the name of the collection/table

// Export the User model for use in other parts of the application
module.exports = UserModel;

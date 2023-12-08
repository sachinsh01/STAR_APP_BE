// Import the Mongoose module
const Mongoose = require("mongoose");

// Define the schema for the Holidays model
const HolidaysSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  locations: {
    type: Map,
    of: [String],
  },
});

const HolidaysModel = Mongoose.model("Holidays", HolidaysSchema);

module.exports = HolidaysModel;

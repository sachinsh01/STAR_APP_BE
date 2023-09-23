var Mongoose = require("mongoose");

var ProjectSchema = new Mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    vertical: {
        type: String
    },
    horizontal: {
        type: String
    },
    subHorizontal: {
        type: String
    },
    customerName: {
        type: String
    },
    customerID: {
        type: String
    },
    managerID: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

var ProjectModel = Mongoose.model("Project", ProjectSchema);

module.exports = ProjectModel
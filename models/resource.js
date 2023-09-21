var Mongoose = require("mongoose");

var ResourceSchema = new Mongoose.Schema({
    projectID: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    resourceID: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    expectedHours: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

var ResourceModel = Mongoose.model("Resource", ResourceSchema);

module.exports = ResourceModel
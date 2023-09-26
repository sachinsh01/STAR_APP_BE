var Mongoose = require("mongoose");

var ResourceMapSchema = new Mongoose.Schema({
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
    },
    isClientBillable: {
        type: Boolean
    }
});

var ResourceMapModel = Mongoose.model("ResourceMap", ResourceMapSchema);

module.exports = ResourceMapModel
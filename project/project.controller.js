var UserModel = require("../models/user");
var ProjectModel = require("../models/project");
var AttendanceModel = require("../models/attendance");
var ResourceMapModel = require("../models/resourceMap");
const mongoose = require("mongoose");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

exports.createProject = async function (req, res) {
    const project = new ProjectModel(req.body);

    project.save().then(
        (data) => {
            console.log("Project Created Successfully: ", data);
            res.send({
                message: "Project Created!",
            });
        },
        (error) => {
            console.log("Error While Saving the Project", error);
            res
                .status(500)
                .send({ message: "Internal Server Error: Cannot save the Project" });
        }
    );
};

exports.updateProject = async function (req, res) {
    const project = await ProjectModel.findByIdAndUpdate(
        { _id: req.params.projectID },
        req.body
    );

    res.send({
        message: "Action Performed!",
        project: project,
    });
};

exports.projectDetails = async function (req, res) {
    const project = await ProjectModel.findOne({ _id: req.params.projectID });

    res.send(project);
};

exports.getAllProjects = async function (req, res) {
    const projects = await ProjectModel.find({});

    res.send(projects);
};

exports.getManagerProjects = async function (req, res) {
    const user = await UserModel.findOne({ email: req.user.email });
    const projects = await ProjectModel.find({ managerID: user._id });

    res.send(projects);
};

exports.getResourceProjects = async function (req, res) {
    const user = await UserModel.findOne({ email: req.user.email });
    const resources = await ResourceMapModel.find({ resourceID: user._id });

    const projectIDs = resources.map((object) => object.projectID);

    const projects = await ProjectModel.find({ _id: { $in: projectIDs } });

    res.send(projects);
};

exports.deleteProject = async function (req, res) {
    const project = await ProjectModel.findOneAndDelete({
        _id: req.params.projectID,
    });

    if (!project) {
        return res.send({ message: "Project not found!!!" });
    }

    res.send({
        message: "Action Performed!",
        project: project,
    });
};

exports.addResource = async function (req, res) {
    var resource = await ResourceMapModel.find({
        resourceID: req.params.resourceID,
        projectID: req.body.projectID,
    });

    if (resource.length != 0) {
        return res.send({ message: "Resource already added!!!" });
    }

    var resource = new ResourceMapModel({
        projectID: req.body.projectID,
        resourceID: req.params.resourceID,
        expectedHours: req.body.expectedHours,
        description: req.body.description,
    });

    resource.save().then(
        (data) => {
            console.log("Resource Added Successfully: ", data);
            res.send({
                message: "Resource added!",
            });
        },
        (error) => {
            console.log("Error While Saving the Resource", error);
            res
                .status(500)
                .send({ message: "Internal Server Error: Cannot save the Resource" });
        }
    );
};

exports.getResources = async function (req, res) {
    const resources = await ResourceMapModel.find({
        projectID: req.params.projectID,
    });

    res.send(resources);
};

exports.deleteResource = async function (req, res) {
    const resource = await ResourceMapModel.findOneAndDelete({
        resourceID: req.params.resourceID,
    });

    if (!resource) {
        return res.send({ message: "Resource not found!!!" });
    }

    res.send({
        message: "Action Performed!",
        resource: resource,
    });
};

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
    try {
        const projects = await ProjectModel.find({});
        const finalData = await Promise.all(projects.map(async (project) => {
            const user = await UserModel.findOne({ _id: project.managerID });

            return {
                ...project._doc,
                managerName: user ? user.name : null,
                managerImage: user ? user.image : null
            };
        }));

        res.send(finalData);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};


exports.getManagerProjects = async function (req, res) {
    const user = await UserModel.findOne({ email: req.user.email });
    const projects = await ProjectModel.find({ managerID: user._id });

    const projectsFinal = projects.map((project) => ({
        ...project._doc, // To extract the document and convert it to a plain object
        managerImage: user.image,
        managerName: user.name
    }));

    res.send(projectsFinal);
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

    const user = await UserModel.findOne({email: req.params.email});

    var resource = await ResourceMapModel.find({
        resourceID: user._id,
        projectID: req.body.projectID,
        expectedHours: req.body.expectedHours
    });

    if (resource.length != 0) {
        return res.send({ message: "Resource already added!!!" });
    }

    var resource = new ResourceMapModel({
        projectID: req.body.projectID,
        resourceID: user._id,
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
    try {
        const resourceData = await ResourceMapModel.find({
            projectID: req.body.projectID,
        });

        const finalData = await Promise.all(resourceData.map(async (resource) => {
            const user = await UserModel.findOne({ _id: resource.resourceID });

            return {
                ...resource._doc,
                name: user ? user.name : null,
                image: user ? user.image : null,
                designation: user ? user.designation : null,
            };
        }));

        res.send(finalData);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

exports.deleteResource = async function (req, res) {
    const resource = await ResourceMapModel.findOneAndDelete({
        _id: req.params.resourceID,
    });

    if (!resource) {
        return res.send({ message: "Resource not found!!!" });
    }

    res.send({
        message: "Action Performed!",
        resource: resource,
    });
};

// Import necessary models and libraries
const UserModel = require("../models/user");
const ProjectModel = require("../models/project");
const ResourceMapModel = require("../models/resourceMap");
const TimesheetModel = require("../models/timesheet");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Create a new project
exports.createProject = async function (req, res) {

    const project = new ProjectModel(req.body);

    // Save the new project in the database
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


// Update a project
exports.updateProject = async function (req, res) {
    // Find and update the project based on the provided ID
    const project = await ProjectModel.findByIdAndUpdate(
        { _id: req.params.projectID.toString() },
        req.body
    );

    // Send a response confirming the action
    res.send({
        message: "Action Performed!",
        project: project,
    });
};

// Get details of a project
exports.projectDetails = async function (req, res) {
    // Find and retrieve details of the project using the provided ID
    const project = await ProjectModel.findOne({ _id: req.params.projectID.toString() });
    res.send(project);
};

// Get all projects
exports.getAllProjects = async function (req, res) {
    try {
        // Retrieve all projects from the database
        const projects = await ProjectModel.find({});
        const finalData = await Promise.all(projects.map(async (project) => {
            // Find the manager associated with each project
            const user = await UserModel.findOne({ _id: project.managerID });

            // Return project data with manager information
            return {
                ...project._doc,
                managerName: user ? user.name : null,
                managerImage: user ? user.image : null
            };
        }));

        // Send the final data with manager details
        res.send(finalData);
    } catch (error) {
        // Send an error message if an error occurs
        res.status(500).send("Internal Server Error");
    }
};

// Get projects managed by a user
exports.getManagerProjects = async function (req, res) {
    // Find the user by email
    const user = await UserModel.findOne({ email: req.user.email.toString() });
    
    // Find projects managed by the user
    const projects = await ProjectModel.find({ managerID: user._id });

    // Map projects to include manager information
    const projectsFinal = projects.map((project) => ({
        ...project._doc,
        managerImage: user.image,
        managerName: user.name
    }));

    // Send the final list of projects with manager details
    res.send(projectsFinal);
};

// Get projects assigned to a resource
exports.getResourceProjects = async function (req, res) {
    // Find the user by email
    const user = await UserModel.findOne({ email: req.user.email.toString() });
    
    // Find resources assigned to the user
    const resources = await ResourceMapModel.find({ resourceID: user._id });

    // Extract project IDs from the resources
    const projectIDs = resources.map((object) => object.projectID);

    // Find projects associated with the resource IDs
    const projects = await ProjectModel.find({ _id: { $in: projectIDs } });

    // Send the list of projects assigned to the resource
    res.send(projects);
};

// Delete a project
exports.deleteProject = async function (req, res) {
    // Find the project by ID and delete it
    const project = await ProjectModel.findOneAndDelete({
        _id: req.params.projectID,
    });

    // If the project doesn't exist, send a message indicating the same
    if (!project) {
        return res.send({ message: "Project not found!!!" });
    }
  );
};

exports.getResources = async function (req, res) {
  try {
    const resourceData = await ResourceMapModel.find({
      projectID: req.body.projectID,
    });

    const finalData = await Promise.all(
      resourceData.map(async (resource) => {
        const user = await UserModel.findOne({ _id: resource.resourceID });

        return {
          ...resource._doc,
          name: user ? user.name : null,
          image: user ? user.image : null,
          designation: user ? user.designation : null,
        };
      })
    );

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

// Projects data for plotting
exports.getDataOfProjects = async function (req, res) {
  try {
    //find all the projects
    const projects = await ProjectModel.find({}, "id projectName");

    // map project id to project names
    const projectArray = projects.reduce((result, project) => {
      result[project.id] = {
        projectName: project.projectName,
        projectObjectId: project._id,
        hours: 0,
        expectedHours: 0,
      };
      return result;
    }, {});

    const projectHours = {};

    for (let projectId in projectArray) {
      const timesheets = await TimesheetModel.find({
        projectID: projectArray[projectId].projectObjectId,
      });

      const totalHours = timesheets.reduce((hours, timesheet) => {
        return hours + timesheet.totalHours.reduce((a, b) => a + b, 0);
      }, 0);

      //find the expected hours from each resourcemap
      let totalExpectedHours = 0;

      for (const timesheet of timesheets) {
        const resourceMap = await ResourceMapModel.find({
          resourceID: timesheet.resourceID,
          projectID: timesheet.projectID,
        });
        totalExpectedHours += resourceMap.reduce(
          (a, b) => a + b.expectedHours,
          0
        );
      }

      projectArray[projectId].hours = totalHours;
      projectArray[projectId].expectedHours = totalExpectedHours;
    }

    //send required data for plotting
    res.send({ projectArray });
  } catch (error) {
    console.log("error -> ", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Project Managers data for plotting
exports.getDataOfProjectsManagers = async function (req, res) {
  try {
    //all managers
    const managers = await ProjectModel.distinct("managerID");

    const managersData = {};

    for (const managerID of managers) {
      // all projects under a manager
      const projects = await ProjectModel.find({ managerID });
      const manager = await UserModel.findOne({ _id: managerID });

      const projectIDsData = projects.map((project) => {
        return {
          projectObjectId: project._id,
          projectId: project.id,
          projectName: project.projectName,
          managerId: managerID,
        };
      });

      let totalHours = 0;
      let totalExpectedHours = 0;

      for (const projectData of projectIDsData) {
        const projectObjectId = projectData.projectObjectId;

        // find hours from each timesheet in each project under a manager
        const timesheets = await TimesheetModel.find({
          projectID: projectObjectId,
        });

        const hoursInOneProject = timesheets.reduce((hours, timesheet) => {
          return hours + timesheet.totalHours.reduce((a, b) => a + b, 0);
        }, 0);

        totalHours += hoursInOneProject;

        //find the expected hours from each resourcemap
        for (const timesheet of timesheets) {
          const resourceMap = await ResourceMapModel.find({
            resourceID: timesheet.resourceID,
            projectID: timesheet.projectID,
          });
          totalExpectedHours += resourceMap.reduce(
            (a, b) => a + b.expectedHours,
            0
          );
        }

      }

      managersData[managerID] = {
        manager: manager.name,
        projectName: projectIDsData
          .filter((projectData) => projectData.managerId === managerID)
          .map((projectData) => projectData.projectName),
        hours: totalHours,
        expectedHours: totalExpectedHours,
      };
    }

    res.send({ managersData });
  } catch (error) {
    console.log("error", error);
    res.send({ error: error });
  }
};
// Add a resource to a project
exports.addResource = async function (req, res) {
    // Find the user by email in the request parameters
    const user = await UserModel.findOne({email: req.params.email});

    // Check if the resource with the same details already exists
    let resource = await ResourceMapModel.find({
        resourceID: user._id,
        projectID: req.body.projectID,
        expectedHours: req.body.expectedHours
    });

    // If the resource already exists, send a message indicating the same
    if (resource.length != 0) {
        return res.send({ message: "Resource already added!!!" });
    }

    // Create a new resource object
    resource = new ResourceMapModel({
        projectID: req.body.projectID,
        resourceID: user._id,
        expectedHours: req.body.expectedHours,
        description: req.body.description,
    });

    // Save the new resource and handle any errors or success
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

// Get project resources
exports.getResources = async function (req, res) {
    try {
        // Find resource data based on the projectID
        const resourceData = await ResourceMapModel.find({
            projectID: req.body.projectID.toString(),
        });

        // Use Promise.all to handle asynchronous operations for each resource
        const finalData = await Promise.all(resourceData.map(async (resource) => {
            // Retrieve user data based on the resource's user ID
            const user = await UserModel.findOne({ _id: resource.resourceID });

            // Construct an object with relevant information
            return {
                ...resource._doc,
                name: user ? user.name : null,
                image: user ? user.image : null,
                designation: user ? user.designation : null,
            };
        }));

        // Send the final data as the response
        res.send(finalData);
    } catch (error) {
        // Handle errors by logging and sending an appropriate response
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

// Delete a resource from a project
exports.deleteResource = async function (req, res) {
    // Find and delete a resource based on the resourceID parameter
    const resource = await ResourceMapModel.findOneAndDelete({
        _id: req.params.resourceID.toString(),
    });

    // Check if the resource was not found and send an appropriate message
    if (!resource) {
        return res.send({ message: "Resource not found!!!" });
    }

    // Send a success message along with the deleted resource's data
    res.send({
        message: "Action Performed!",
        resource: resource,
    });
};

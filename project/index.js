// Import the express module
const express = require("express");

// Import the ProjectController and middlewares
const ProjectController = require("./project.controller");
const middlewares = require("../middlewares/checkAuth");

// Create a router instance
const router = express.Router();

// Define various routes for project-related operations
router.get("/all", middlewares.checkAuth, ProjectController.getAllProjects); // Get all projects
router.get("/manager", middlewares.checkAuth, ProjectController.getManagerProjects); // Get projects managed by a user
router.get("/resource", middlewares.checkAuth, ProjectController.getResourceProjects); // Get projects assigned to a resource
router.post("/resources", middlewares.checkAuth, ProjectController.getResources); // Get project resources
router.post("/create", middlewares.checkAuth, ProjectController.createProject); // Create a new project
router.post("/add/:email", middlewares.checkAuth, ProjectController.addResource); // Add a resource to a project
router.delete("/resources/:resourceID", middlewares.checkAuth, ProjectController.deleteResource); // Delete a resource from a project
router.get("/:projectID", middlewares.checkAuth, ProjectController.projectDetails); // Get details of a specific project
router.patch("/:projectID", middlewares.checkAuth, ProjectController.updateProject); // Update a specific project
router.delete("/:projectID", middlewares.checkAuth, ProjectController.deleteProject); // Delete a specific project

// Export the router to be used in other parts of the application
module.exports = router;
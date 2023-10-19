var express = require("express")
var ProjectController = require("./project.controller")
const middlewares = require("../middlewares/checkAuth")

var router = express.Router();

router.get("/getDataOfProjects", ProjectController.getDataOfProjects)
router.get("/getDataOfProjectsManagers", ProjectController.getDataOfProjectsManagers)
router.get("/all", middlewares.checkAuth, ProjectController.getAllProjects)
router.get("/manager", middlewares.checkAuth, ProjectController.getManagerProjects)
router.get("/resource", middlewares.checkAuth, ProjectController.getResourceProjects)
router.post("/resources", middlewares.checkAuth, ProjectController.getResources)
router.post("/create", middlewares.checkAuth, ProjectController.createProject)
router.post("/add/:email", middlewares.checkAuth, ProjectController.addResource)
router.delete("/resources/:resourceID", middlewares.checkAuth, ProjectController.deleteResource)
router.get("/:projectID", middlewares.checkAuth, ProjectController.projectDetails)
router.patch("/:projectID", middlewares.checkAuth, ProjectController.updateProject)
router.delete("/:projectID", middlewares.checkAuth, ProjectController.deleteProject)

module.exports = router
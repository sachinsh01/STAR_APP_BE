var express = require("express")
var ProjectController = require("./project.controller")
const middlewares = require("../middlewares/checkAuth")

var router = express.Router();

router.get("/all", middlewares.checkAuth, ProjectController.getAllProjects)
router.post("/getAttendance", middlewares.checkAuth, ProjectController.getAttendance)
router.get("/manager", middlewares.checkAuth, ProjectController.getManagerProjects)
router.get("/resource", middlewares.checkAuth, ProjectController.getResourceProjects)
router.get("/resources/:projectID", middlewares.checkAuth, ProjectController.getResources)
router.post("/create", middlewares.checkAuth, ProjectController.createProject)
router.post("/add/:resourceID", middlewares.checkAuth, ProjectController.addResource)
router.delete("/resources/:resourceID", middlewares.checkAuth, ProjectController.deleteResource)
router.get("/:projectID", middlewares.checkAuth, ProjectController.projectDetails)
router.patch("/:projectID", middlewares.checkAuth, ProjectController.updateProject)
router.delete("/:projectID", middlewares.checkAuth, ProjectController.deleteProject)


module.exports = router
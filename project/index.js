var express = require("express")
var ProjectController = require("./project.controller")
const middlewares = require("../middlewares/checkAuth")

var router = express.Router();

router.post("/create", middlewares.checkAuth, ProjectController.createProject)


module.exports = router
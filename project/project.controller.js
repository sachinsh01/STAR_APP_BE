var UserModel = require("../models/user")
var ProjectModel  = require("../models/project")
var ResourceModel  = require("../models/resource")
var bcrypt = require("bcrypt")
var jwt = require("jsonwebtoken")

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

exports.createProject = async function(req, res) {

    const project = new ProjectModel(req.body)

    project.save().then((data) => {
        console.log("Project Created Successfully: ", data)
        res.send({
            message: "Project Created!"
        })
    }, (error) => {
        console.log("Error While Saving the Data", error)
        res.status(500).send({message: "Internal Server Error"})
    })
    
}
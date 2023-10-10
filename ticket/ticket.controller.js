var UserModel = require("../models/user")
var TicketModel = require("../models/ticket")
var ProjectModel = require("../models/project");
var bcrypt = require("bcrypt")
var jwt = require("jsonwebtoken")

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

exports.createTicket = async function(req, res) {

    const user = await UserModel.findOne({ email: req.user.email })
    const project = await ProjectModel.findOne({_id: req.body.projectID})

    var ticketData = new TicketModel({
        raisedFrom: user._id,
        raisedTo: project.managerID,
        projectID: req.body.projectID, 
        subject: req.body.subject,
        category: req.body.category,
        description: req.body.description,
        status: "Pending",
        isElevated: false,
        remarks: ""
    })

    ticketData.save().then((data) => {
        console.log("Ticket Raised Successfully: ", data)
        res.send({
            message: "Ticket Raised"
        })
    }, (error) => {
        console.log("Error While Saving the Data", error)
        res.status(500).send({message: "Internal Server Error"})
    })
}

exports.ticketsRaised = async function(req, res) {

    const user = await UserModel.findOne({ email: req.user.email })

    const tickets = await TicketModel.find({ raisedFrom: user._id})

    res.send({
        tickets: tickets,
        name: user.name
    })    
}

exports.ticketsReceived = async function(req, res) {

    const user = await UserModel.findOne({ email: req.user.email })

    const tickets = await TicketModel.find({ raisedTo: user._id })

    res.send(tickets)    
}

exports.ticketsElevated = async function(req, res) {

    const tickets = await TicketModel.find({ isElevated: true })

    res.send(tickets)
}

exports.elevateTicket = async function(req, res) {

    const tickets = await TicketModel.findOneAndUpdate({ _id: req.body.ticketID}, {isElevated: True})

    res.send({message: "Ticket Elevated!"})
}

exports.ticketStatusUpdate = async function(req, res) {

    const ticket = await TicketModel.findOneAndUpdate({ _id: req.body.ticketID}, {status: req.body.status, remarks: req.body.remarks})

    req.send({message: "Status Updated!"})
}
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
        raisedTo: req.body.projectID ? project.managerID : "65278b2ae0fdc97137c24bb5",
        projectID: req.body.projectID ? req.body.projectID : "65278a474a19cc020cd29966", 
        subject: req.body.subject,
        category: req.body.category,
        description: req.body.description,
        status: user._id.toString() === (req.body.projectID ? project.managerID : "65278b2ae0fdc97137c24bb5").toString() ? "Elevated" : "Pending",
        isElevated: user._id.toString() === (req.body.projectID ? project.managerID : "65278b2ae0fdc97137c24bb5").toString(),
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

exports.ticketsRaised = async function (req, res) {
    const user = await UserModel.findOne({ email: req.user.email });
  
    const tickets = await TicketModel.find({ raisedFrom: user._id }).then(async (data) => {
      const resp = await Promise.all(data.map(async (item) => {

        if(item.projectID) {
            const project = await ProjectModel.findOne({ _id: item.projectID });

            if (project) {
                return {
                  subject: item.subject,
                  category: item.category,
                  projectCode: project.id, // Use project.id for the ID field
                  description: item.description,
                  status: item.status,
                  remarks: item.remarks
                };
              }
            
            else {
                return {
                    subject: item.subject,
                    category: item.category,
                    description: item.description,
                    status: item.status,
                    remarks: item.remarks
                  }; // Return the item without a projectCode if project is not found
              }
        }
      }));
  
      res.send({
        tickets: resp,
      });
    });
  };
  
  exports.ticketsReceived = async function(req, res) {
    const user = await UserModel.findOne({ email: req.user.email });

    try {
        const data = await TicketModel.find({ raisedTo: user._id });

        const finalData = await Promise.all(data.map(async (ticket) => {
            const userFrom = await UserModel.findOne({ _id: ticket.raisedFrom });

            let projectID = null;
            if (ticket.projectID) {
                const project = await ProjectModel.findOne({ _id: ticket.projectID });
                projectID = project ? project.id : null;
            }

            return {
                ...ticket._doc,
                image: userFrom.image,
                name: userFrom.name,
                projectID: projectID
            };
        }));
        console.log(finalData)
        res.send({ tickets: finalData });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};  

exports.ticketsElevated = async function(req, res) {

    const tickets = await TicketModel.find({ isElevated: true })

    res.send(tickets)
}

exports.elevateTicket = async function(req, res) {

    const tickets = await TicketModel.findOneAndUpdate({ _id: req.body.ticketID}, {isElevated: req.body.elevate, status: req.body.elevate ? "Elevated" : "Rejected"})

    if(req.body.elevate) {
      res.send({message: "Ticket Elevated!"})
    }
    else {
      res.send({message: "Ticket Rejected!"})
    }  
}

exports.ticketStatusUpdate = async function(req, res) {

    const ticket = await TicketModel.findOneAndUpdate({ _id: req.body.ticketID}, {status: req.body.status, remarks: req.body.remarks})

    req.send({message: "Status Updated!"})
}
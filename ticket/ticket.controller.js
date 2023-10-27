// Import necessary models and libraries
const UserModel = require("../models/user") // User model for user-related operations
const TicketModel = require("../models/ticket") // Ticket model for ticket-related operations
const ProjectModel = require("../models/project"); // Project model for project-related operations

// Check if the environment is not in production and configure the environment variables
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

// Async function for creating a ticket
exports.createTicket = async function (req, res) {

    // Find the user based on the email
    const user = await UserModel.findOne({ email: req.user.email })

    // Find the project based on the provided project ID
    const project = await ProjectModel.findOne({ _id: req.body.projectID })

    // Check if the category is not provided
    if (req.body.category === "") {
        return res.send({
            message: "Ticket Not Raised, Add Category!",
            error: true
        })
    }

    // Check if the category is "Projects Inquiries" but the project ID is not provided
    if (req.body.category === "Projects Inquiries" && !req.body.projectID) {
        return res.send({
            message: "Ticket Not Raised, Add Project ID!",
            error: true
        })
    }

    // Create a new ticket with the provided data
    const ticketData = new TicketModel({
        raisedFrom: user._id,
        raisedTo: req.body.projectID ? project.managerID : "65278b2ae0fdc97137c24bb5", // If projectID is provided, set the raisedTo as the project's manager, else set a default value
        projectID: req.body.projectID ? req.body.projectID : "65278a474a19cc020cd29966", // If projectID is provided, use it, else set a default value
        subject: req.body.subject,
        category: req.body.category,
        description: req.body.description,
        status: user._id.toString() === (req.body.projectID ? project.managerID : "65278b2ae0fdc97137c24bb5").toString() ? "Elevated" : (req.body.category === "Technical Issue" ? "Elevated" : "Pending"), // Set the status based on whether the user is the manager or not
        isElevated: user._id.toString() === (req.body.projectID ? project.managerID : "65278b2ae0fdc97137c24bb5").toString() || req.body.category === "Technical Issue", // Set isElevated based on whether the user is the manager or not
        remarks: ""
    })

    // Save the ticket data to the database
    ticketData.save().then((data) => {
        console.log("Ticket Raised Successfully: ", data)
        res.send({
            message: "Ticket Raised"
        })
    }, (error) => {
        console.log("Error While Saving the Data", error)
        res.status(500).send({ message: "Internal Server Error" })
    })
}

// Async function for fetching tickets raised by the user
exports.ticketsRaised = async function (req, res) {
    // Find the user based on the email
    const user = await UserModel.findOne({ email: req.user.email });

    // Find all the tickets raised by the user
    TicketModel.find({ raisedFrom: user._id }).then(async (data) => {
        // Map each ticket data to the required format
        const resp = await Promise.all(data.map(async (item) => {

            // Check if the ticket has a projectID
            if (item.projectID) {
                // Find the project based on the projectID
                const project = await ProjectModel.findOne({ _id: item.projectID });

                // If the project is found, return the ticket data with the projectCode field
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
                // If the project is not found, return the ticket data without the projectCode field
                else {
                    return {
                        subject: item.subject,
                        category: item.category,
                        description: item.description,
                        status: item.status,
                        remarks: item.remarks
                    };
                }
            }
        }));

        // Send the response with the ticket data
        res.send({
            tickets: resp,
        });
    });
};

// Async function for fetching tickets received by the user
exports.ticketsReceived = async function (req, res) {
    // Find the user based on the email
    const user = await UserModel.findOne({ email: req.user.email });

    try {
        // Find all tickets received by the user
        const data = await TicketModel.find({ raisedTo: user._id });

        // Map each ticket data to the required format
        const finalData = await Promise.all(data.map(async (ticket) => {
            // Find the user who raised the ticket
            const userFrom = await UserModel.findOne({ _id: ticket.raisedFrom });

            let projectID = null;
            // Check if the ticket has a projectID and fetch the associated project
            if (ticket.projectID) {
                const project = await ProjectModel.findOne({ _id: ticket.projectID });
                projectID = project ? project.id : null;
            }

            // Return the ticket data with additional user and project information
            return {
                ...ticket._doc,
                image: userFrom.image,
                name: userFrom.name,
                projectID: projectID
            };
        }));

        // Send the response with the ticket data
        res.send({ tickets: finalData });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

// Async function for fetching all elevated tickets
exports.ticketsElevated = async function (req, res) {
    // Find all tickets that are elevated
    const data = await TicketModel.find({
        isElevated: true,
        status: { $ne: "Closed" }
    });

    const finalData = await Promise.all(data.map(async (ticket) => {
        // Find the user who raised the ticket
        const userFrom = await UserModel.findOne({ _id: ticket.raisedFrom });

        let projectID = null;
        // Check if the ticket has a projectID and fetch the associated project
        if (ticket.projectID) {
            const project = await ProjectModel.findOne({ _id: ticket.projectID });
            projectID = project ? project.id : null;
        }

        // Return the ticket data with additional user and project information
        return {
            ...ticket._doc,
            image: userFrom.image,
            name: userFrom.name,
            projectID: projectID
        };
    }))

    // Send the response with the elevated tickets
    res.send(finalData);
}

// Async function for elevating or rejecting a ticket
exports.elevateTicket = async function (req, res) {
    // Find and update the ticket based on the provided ticket ID
    TicketModel.findOneAndUpdate({ _id: req.body.ticketID }, { isElevated: req.body.elevate, status: req.body.elevate ? "Elevated" : "Rejected", remarks: req.body.remarks }).then((data) => {
        // Send the response based on the ticket elevation status
        if (req.body.elevate) {
            res.send({ message: "Ticket Elevated!" })
        }
        else {
            res.send({ message: "Ticket Rejected!" })
        }
    })
}

// Async function for updating the status of a ticket
exports.ticketStatusUpdate = async function (req, res) {
    // Find and update the ticket status based on the provided ticket ID
    TicketModel.findOneAndUpdate({ _id: req.body.ticketID }, { status: req.body.status, remarks: req.body.remarks }).then((data) => {

        // Send the response after updating the ticket status
        res.send({ message: "Status Updated!" })
    })
}
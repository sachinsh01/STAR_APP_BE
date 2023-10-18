// Import necessary libraries and controllers
const express = require("express")
const TicketController = require("./ticket.controller")
const middlewares = require("../middlewares/checkAuth")

const router = express.Router();

// Define routes for various ticket operations
router.post("/create", middlewares.checkAuth, TicketController.createTicket) // Route for creating a new ticket
router.patch("/elevate", middlewares.checkAuth, TicketController.elevateTicket) // Route for elevating a ticket
router.patch("/status", middlewares.checkAuth, TicketController.ticketStatusUpdate) // Route for updating ticket status
router.get("/raised", middlewares.checkAuth, TicketController.ticketsRaised) // Route for getting raised tickets
router.get("/received", middlewares.checkAuth, TicketController.ticketsReceived) // Route for getting received tickets
router.get("/elevated", middlewares.checkAuth, TicketController.ticketsElevated) // Route for getting elevated tickets

module.exports = router // Export the router

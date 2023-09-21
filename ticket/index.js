var express = require("express")
var TicketController = require("./ticket.controller")
const middlewares = require("../middlewares/checkAuth")

var router = express.Router();

router.post("/create", middlewares.checkAuth, TicketController.createTicket)
router.patch("/elevate", middlewares.checkAuth, TicketController.elevateTicket)
router.patch("/status", middlewares.checkAuth, TicketController.ticketStatusUpdate)
router.get("/raised", middlewares.checkAuth, TicketController.ticketsRaised)
router.get("/received", middlewares.checkAuth, TicketController.ticketsReceived)
router.get("/elevated", middlewares.checkAuth, TicketController.ticketsElevated)


module.exports = router
const express = require("express");
const router = express.Router();

const ProjectsController = require("../controllers/ProjectsController");
const TicketController = require("../controllers/TicketController");

router.post("/", ProjectsController.create); //creates a project
router.get("/", ProjectsController.show); //returns all the projects of a certain user
router.put("/:projectId", ProjectsController.update); //updates a project
router.delete("/:projectId", ProjectsController.deleteProject); //deletes a project

router.post("/ticket/:projectId", TicketController.createTicket); // creates a ticket in a specific project
router.get("/ticket/:projectId", TicketController.showTickets); // return All tickets in a specific project
router.put("/ticket/:projectId/:ticketId", TicketController.updateTicket); //updates a specific topic inside a project
router.delete("/ticket/:projectId/:ticketId", TicketController.deleteTicket); // deletes a ticket from a project

// router.post("/ticket/:projectId/:ticketId", CommentsController.showTickets);
// router.get("/ticket/:projectId/:ticketId", CommentsController.showTickets);
// router.put("/ticket/:projectId/:ticketId", CommentsController.showTickets);

module.exports = router;

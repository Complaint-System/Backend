const { Project } = require("../models/Project");
const { Ticket } = require("../models/Ticket");
const { Comment } = require("../models/Comment");
const { User } = require("../models/User");

const createTicket = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).send({ error: "Project not found" });
    }

    const ticket = new Ticket({
      creator: req.user.id,
      title: req.body.title,
      description: req.body.description,
      comments: [],
    });

    project.tickets.push(ticket);

    await project.save();
    return res.status(201).send({ message: "Successfully created", ticket });
  } catch (error) {
    return res.status(500).send({ error: "Failed to create ticket" });
  }
};

const showTickets = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).send({ error: "Project not found" });
    }

    const tickets = project.tickets;
    if (tickets) return res.json(tickets);
    else {
      return res.status(404).send({ error: "No tickets have been found" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Failed to create ticket" });
  }
};

const updateTicket = async (req, res, next) => {
  try {
    const { projectId, ticketId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).send({ error: "Project not found" });
    }

    const ticket = project.tickets.id(ticketId);

    if (!ticket) {
      return res.status(404).send({ error: "Ticket not found" });
    }

    ticket.title = req.body.title;
    ticket.description = req.body.description;

    await project.save();

    res.send({ message: "Ticket updated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Failed to update ticket", error });
  }
};

const deleteTicket = async (req, res, next) => {
  try {
    const { projectId, ticketId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).send({ error: "Project not found" });
    }

    const ticket = project.tickets.id(ticketId);

    if (!ticket) {
      return res.status(404).send({ error: "Ticket not found" });
    }

    ticket.remove();

    await project.save();

    res.send({ message: "Ticket successfully deleted" });
  } catch (error) {
    return res.status(500).send({ error: "Failed to delete ticket" });
  }
};

module.exports = { createTicket, showTickets, updateTicket, deleteTicket };

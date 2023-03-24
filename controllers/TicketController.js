const { Project } = require("../models/Project");
const { Ticket } = require("../models/Ticket");
const { Comment } = require("../models/Comment");
const { User } = require("../models/User");

const createTicket = async (req, res, next) => {
  try {
    const ticket = new Ticket({
      creatorId: req.user.id,
      projectId: req.params.projectId,
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      comments: [],
    });

    const savedTicket = await ticket.save();
    return res
      .status(201)
      .send({ message: "Successfully created", savedTicket });
  } catch (error) {
    return res.status(500).send({ error: "Failed to create ticket" });
  }
};

const showTickets = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const tickets = await Ticket.find({
      projectId: projectId,
    }).populate({ path: "creatorId", select: "name" });

    if (tickets) {
      return res.json(tickets);
    } else {
      return res.status(404).send({ error: "No tickets have been found" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ error: "Failed to show ticket", message: error });
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

    ticket.title = req.body.title || ticket.title;
    ticket.description = req.body.description || ticket.description;

    await project.save();

    res.send({ message: "Ticket updated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Failed to update ticket", error });
  }
};

const deleteTicket = async (req, res, next) => {
  try {
    const { ticketId } = req.params;

    const deletedTicket = await Ticket.findByIdAndDelete(ticketId);

    if (!deletedTicket) {
      return res.status(404).send({ error: "Ticket not found" });
    }

    res.send({ message: "Ticket successfully deleted" });
  } catch (error) {
    return res.status(500).send({ error: "Failed to delete ticket" });
  }
};

const getTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { comments } = req.query;

    const ticket = await Ticket.findById(ticketId)
      .populate({ path: "creatorId", select: "name" })
      .populate({ path: "projectId", select: "name" })
      .populate({
        path: "comments",
      });
    if (!ticket) {
      return res.status(404).send({ error: "Ticket not found" });
    }
    return res.status(200).json(ticket);
  } catch (error) {
    return res.status(400).send({ message: "Failed to get ticket", error });
  }
};

module.exports = {
  createTicket,
  showTickets,
  updateTicket,
  deleteTicket,
  getTicket,
};

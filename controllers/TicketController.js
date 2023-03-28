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
      closed: false,
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
    }).populate({ path: "creatorId", select: "name profileImage" });

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
    const { ticketId } = req.params;
    const { title, description, priority, closed } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        title: title && title,
        description: description && description,
        priority: priority && priority,
        closed: closed && closed,
      },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).send({ error: "Ticket not found", ticket });
    }

    res.send({ message: "Ticket updated successfully", ticket });
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

    const ticket = await Ticket.findById(ticketId).populate([
      { path: "creatorId", select: "name" },
      { path: "projectId", select: "name profileImage" },
      {
        path: "comments",
        populate: {
          path: "creatorId",
          select: "name profileImage",
        },
      },
    ]);

    if (!ticket) {
      return res.status(404).send({ error: "Ticket not found" });
    }

    return res.status(200).json({ ticket });
  } catch (error) {
    return res.status(400).send({ message: "Failed to get ticket", error });
  }
};

const pushComment = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { text } = req.body;

    const ticket = await Ticket.findById(ticketId);

    const newComment = await Comment.create({
      creatorId: req.user.id,
      projectId: ticket.projectId,
      text: text,
      ticketId: ticketId,
    });

    ticket.comments.push(newComment._id);

    await ticket.save();
    return res.status(200).json({
      newComment,
      message: "Sucessfuly created a new comment",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({
      deletedComment,
      message: "Comment sucessfuly deleted",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createTicket,
  showTickets,
  updateTicket,
  deleteTicket,
  getTicket,
  pushComment,
  deleteComment,
};

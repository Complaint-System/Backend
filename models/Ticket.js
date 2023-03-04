const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comment = require("./Comment");

const ticketSchema = new Schema(
  {
    creatorId: { type: Schema.Types.ObjectId, ref: "User" },
    projectId: { type: Schema.Types.ObjectId, ref: "Project" },
    title: { type: String },
    description: { type: String },
    priority: { type: String, enum: ["High", "Medium", "Low"] },
    comments: [Comment.commentSchema],
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = { Ticket, ticketSchema };

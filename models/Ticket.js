const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comment = require("./Comment");

const ticketSchema = new Schema(
  {
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String },
    description: { type: String },
    comments: [Comment.commentSchema],
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = { Ticket, ticketSchema };

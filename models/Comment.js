const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ticketId: { type: Schema.Types.ObjectId, ref: "Ticket", required: true },
    proejctId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    text: { type: String, required: true },
  },
  { timestamps: true },
  { strict: "throw" }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = { Comment, commentSchema };

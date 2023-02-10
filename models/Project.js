const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Ticket = require("./Ticket");

const projectSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tickets: [Ticket.ticketSchema],
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
module.exports = { Project, projectSchema };

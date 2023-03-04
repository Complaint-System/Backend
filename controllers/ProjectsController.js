const { Project } = require("../models/Project");
const { Ticket } = require("../models/Ticket");
const { Comment } = require("../models/Comment");
const { User } = require("../models/User");

const create = async (req, res, next) => {
  try {
    // const user = await User.findById(req.user.id);
    // if (!user) {
    //   return res.status(404).send({ error: "User not found" });
    // }

    const project = new Project({
      owner: req.user.id,
      tickets: [],
      name: req.body.name,
      description: req.body.description,
    });

    const savedProject = await project.save();
    return res
      .status(201)
      .send({ message: "Successfully created", project: savedProject });
  } catch (error) {
    return res
      .status(400)
      .send({ error: "Failed to create project", message: error.message });
  }
};

const show = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const projects = await Project.find({ owner: req.user.id });
    if (projects) return res.json(projects);
    else {
      return res.status(404).send({ error: "No projects have been found" });
    }
  } catch (error) {
    return res
      .status(400)
      .send({ error: "Failed to retrieve projects", message: error.message });
  }
};

const update = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).send({ error: "Project not found" });
    }

    if (project.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .send({ error: "You are not authorized to update this project" });
    }
    const updates = req.body;
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.projectId,
      updates
    );

    return res
      .status(200)
      .send({ message: "Successfully updated", updatedProject });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Failed to update projects", error });
  }
};

const deleteProject = async (req, res, next) => {
  // const project = await Project.findById({id: req.params.projectId})
  // if (!project) {
  //     return res.status(404).send({ error: "Project not found" });
  //   }

  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).send({ error: "Project not found" });
    }

    if (project.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .send({ error: "You are not authorized to delete this project" });
    }
    await project.remove();

    return res.status(200).send({ message: "Successfully deleted project" });
  } catch (error) {
    return res.status(400).send({ message: "Failed to delete project", error });
  }
};

const verifyAuth = async (req, res) => {
  res.json({
    message: "Authentication Succeed",
    user: req.user.id,
  });
};

module.exports = { create, show, update, deleteProject, verifyAuth };

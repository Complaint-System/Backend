require("dotenv").config();
var cors = require("cors");

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

const connectDB = require("./db");
connectDB();

const AuthRoute = require("./routes/auth");
const ProjectsRoute = require("./routes/projects");
const authenticate = require("./middlewares/Authenticate");

app.use(cors());
app.use(express.json());

app.use("/auth", AuthRoute);
app.use("/api/project", authenticate.authenticate, ProjectsRoute);
app.get("/verifyAuth", authenticate.authenticate);
// app.use("/api/user", authenticate.authenticate, ProjectsRoute);

app.listen(port, () => console.log(`listening on port ${port}!`));

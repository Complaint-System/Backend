const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/UsersController");

router.get("/", UsersController.searchUser); // Returns users based on search (only public info)
router.get("/me", UsersController.getMebyId); // Returns logged in user
router.put("/me", UsersController.updateMeById);
// router.delete("/me")

module.exports = router;

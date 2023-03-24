const { User } = require("../models/User");
const bcrypt = require("bcryptjs");

const searchUser = async (req, res) => {
  const { searchQuery } = req.query;
  if (!searchQuery) return res.status(404).json({ message: "No search query" });
  try {
    const user = await User.find(
      {
        $or: [
          { name: { $regex: `^${searchQuery}` } },
          { email: { $regex: `^${searchQuery}` } },
        ],
      },
      "_id name email phone profileImage "
    );
    if (user.length === 0) {
      return res.json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getMebyId = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -updatedAt"
    );
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).send({ message: "Failed to get user", error });
  }
};

const updateMeById = async (req, res) => {
  const { name, email, phone, password, profileImage } = req.body.data;
  try {
    const newUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: name && name,
        email: email && email,
        phone: phone && phone,
        profileImage: profileImage && profileImage,
        password: password.length > 6 && (await bcrypt.hash(password, 10)),
      },
      { new: true }
    ).select("-password");
    return res.status(200).json({
      message: "Sucessfuly updated user",
      newUser,
      error: false,
    });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Failed to update user", error: true, errorMsg: error });
  }
};

module.exports = { searchUser, getMebyId, updateMeById };

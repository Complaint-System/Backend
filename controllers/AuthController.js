const { User } = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = (req, res, next) => {
  let hashedPassword;
  bcrypt.hash(req.body.password, 10, (err, hashedPass) => {
    if (err) {
      res.json({
        error: err,
      });
    } else {
      hashedPassword = hashedPass;
      let user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: hashedPass,
      });
      user
        .save()
        .then((user) => {
          res.json({ message: "User Added Successfuly" });
        })
        .catch((err) => {
          res.json({ err: err });
        });
    }
  });
};

// const login = (req, res, next) => {
//   var username = req.body.username;
//   var password = req.body.password;

//   User.findOne({ $or: [{ email: username }, { phone: username }] }).then(
//     (user) => {
//       if (user) {
//         bcrypt.compare(password, user.password, function (err, result) {
//           if (err) {
//             res.json({
//               error: err,
//             });
//           }
//           if (result) {
//             let token = jwt.sign({ id: user._id }, process.env.secretKey, {
//               expiresIn: "1h",
//             });
//             res.json({
//               message: "Successfuly connected",
//               token,
//             });
//           } else {
//             res.json({
//               message: "Failed to login! Check credentials",
//             });
//           }
//         });
//       } else {
//         res.json({
//           message: "No user found!",
//         });
//       }
//     }
//   );
// };

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: username }, { phone: username }],
    });
    if (!user) {
      return res.status(400).json({
        message: "No user found!",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Failed to login! Check credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Successfully connected",
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while logging in",
      error: error.message,
    });
  }
};
module.exports = { register, login };

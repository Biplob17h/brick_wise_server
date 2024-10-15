import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import generateTokenAndSetCookie from "../utils/setCookie.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

const userSignUp = async (req, res) => {
  try {
    const { password, confirmPassword, email } = req.body;

    // validate email
    const isUser = await User.findOne({ email });
    if (isUser) {
      return res.status(400).json({
        status: "fail",
        message: "Email already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    // GENERATE TOKEN
    const token = crypto.randomBytes(32).toString("hex");

    // create user
    const user = { ...req.body, password: hashedPassword, token: token };
    const newUser = new User(user);

    // save to database
    const result = await newUser.save();

    // send email
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS,
      },
    });
    if (result._id) {
      transport.sendMail({
        from: "biplob17h@gmail.com",
        to: email,
        subject: "confirm email",
        html: `
          <html>
          <body>
          <h1>Welcome to Brick Wise</h1>
          <h3>Confirm your email</h3><br/><br/><br/><br/>
          <a href='https://brick-wise-server.onrender.com/api/v1/user/confirm/${token}'>Confirm your email</a>
          </body>
          </html>
          `,
      });
    }

    // send response
    res.status(201).json({
      status: "success",
      message: "User created successfully",
      result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const confirmUserEmail = async (req, res) => {
  try {
    const token = req.params.token;
    const user = await User.findOneAndUpdate(
      { token: token },
      { $set: { token: "", status: "active" } },
      { new: true }
    );
    if (!user) {
      return res.send(`<h1>Token is not valid</h1>`);
    }
    res.send(`<h1>Email confirmed successfully</h1>`);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const resendConfirmEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    // GENARTE TOKEN
    const token = crypto.randomBytes(32).toString("hex");

    // send email
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS,
      },
    });
    transport.sendMail({
      from: "biplob17h@gmail.com",
      to: email,
      subject: "confirm email",
      html: `
          <html>
          <body>
          <h1>Welcome to Brick Wise</h1>
          <h3>Confirm your email</h3><br/><br/><br/><br/>
          <a href='https://brick-wise-server.onrender.com/api/v1/user/confirm/${token}'>Confirm your email</a>
          </body>
          </html>
          `,
    });
    const result = await User.findOneAndUpdate(
      { email },
      {
        $set: { token: token },
      }
    );
    res.status(200).json({
      status: "success",
      message: "Email resent successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  // check credentials
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid credentials",
    });
  }

  // compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid credentials",
    });
  }

  // generate JWT token
  const token = await generateTokenAndSetCookie(user?._id, res);

  // send response
  res.status(200).json({
    status: "success",
    message: "Login successful",
    token,
  });
  try {
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
const getUser = async (req, res) => {
  try {
    // setting user in verify user
    const user = req.user;

    // check if user is active or not
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Not authenticated",
      });
    }

    // send response
    res.status(200).json({
      status: "success",
      message: "User details fetched successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
const getAllUser = async (req, res) => {
  try {
    // get all users
    const users = await User.find({}).select(["-password", "-_id"]);
    res.status(200).json({
      status: "success",
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { email } = req.body;

    // get user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "User not found",
      });
    }

    // update user
    // same update method  [ref: see line 118-120]
    const updatedUser = await User.updateOne({ email }, { $set: req.body });

    // send response
    res.status(200).json({
      status: "success",
      message: "User profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
const changeUserPassword = async (req, res) => {
  try {
    // get user and password
    const { newPassword, email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "User not found",
      });
    }

    // update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserPassword = await User.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    // send response
    res.status(200).json({
      status: "success",
      message: "User password updated successfully",
      updatedUserPassword,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
const userLogout = async (req, res) => {
  try {
    // clear user cookie to logout
    res.clearCookie("brick_wise_cookie");
    res.status(200).json({
      status: "success",
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

export {
  userSignUp,
  userLogin,
  getUser,
  getAllUser,
  updateUserProfile,
  changeUserPassword,
  userLogout,
  confirmUserEmail,
  resendConfirmEmail,
};

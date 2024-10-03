import nodemailer from "nodemailer";
import crypto from "crypto";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import generateTokenAndSetCookie from "../utils/setCookie.js";

const userSignUpFirstStep = async (req, res) => {
  try {
    const { email } = req.body;

    // check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists",
      });
    }

    // GENERATE TOKEN
    const token = crypto.randomBytes(32).toString("hex");

    // manage user
    const user = {
      email,
      confirmToken: token,
    };

    // save user to database with token
    const result = await User.create(user);

    // send email
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS,
      },
    });
    if (result?._id) {
      transport.sendMail({
        from: "biplob17h@gmail.com",
        to: email,
        subject: "confirm email",
        html: `
            <html>
            <body>
            <h1>Welcome to Brick Wise</h1>
            <a href='http://localhost:5000/api/v1/user/confirm/${token}'>Confirm your email</a>
            </body>
            </html>
            `,
      });
    }
    // send response
    res.status(200).json({
      status: "success",
      message: "Email sent successfully",
      token,
      result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
const confirmUserVerifyToken = async (req, res) => {
  try {
    // GET TOKEN
    const confirmToken = req.params?.token;

    // QUERY
    const query = { confirmToken: confirmToken };

    // FIND USER
    const user = await User.findOne(query);
    if (!user) {
      return res.status(400).json({
        status: "Failed",
        message: "Your confirm token is not valid",
      });
    }

    // update user
    const result = await User.updateOne(query, {
      $set: { status: "active", step: 2, confirmToken: "activated" },
    });

    // send response [Design for what will show after email confirmation]
    res.send(`
    <h1>Your Account Active SuccessFully</h1>
    `);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
const userSignUpSecondStep = async (req, res) => {
  try {
    const { password, email } = req.body;

    // find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "User not found",
      });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;

    // update user details
    // [update user
    //  It set req.body so be careful that req.body name and database name are the same exe: If you have firstName database in req.body you have to use firstName]

    const updatedUser = await User.updateOne({ email }, { $set: req.body });
    if (!updatedUser) {
      return res.status(400).json({
        status: "fail",
        message: "Failed to update user details",
      });
    }
    // send response
    res.status(200).json({
      status: "success",
      message: "User details updated successfully",
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
  if (user.status !== "active") {
    return res.status(401).json({
      status: "fail",
      message: "Your account is not active, please confirm your email",
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
  generateTokenAndSetCookie(user?._id, res);

  // send response
  res.status(200).json({
    status: "success",
    message: "Login successful",
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
    if (user?.status === "inactive" || user?.status === "blocked") {
      return res.status(403).json({
        status: "fail",
        message: "Your account is not active or blocked",
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
  userSignUpFirstStep,
  userSignUpSecondStep,
  userLogin,
  getUser,
  getAllUser,
  confirmUserVerifyToken,
  updateUserProfile,
  changeUserPassword,
  userLogout,
};

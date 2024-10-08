import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import generateTokenAndSetCookie from "../utils/setCookie.js";

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
    // validate password
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "fail",
        message: "Passwords do not match",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // create user
    const user = { ...req.body, password: hashedPassword };
    const newUser = await User.create(user);

    // save to database
    const result = await newUser.save();
    // send response
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
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
};

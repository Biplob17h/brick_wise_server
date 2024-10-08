import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
const verifyUser = async (req, res, next) => {
  try {
    const token = await req.headers?.authorization?.split(" ")[1];
    console.log(token)
    if (!token) {
      throw new Error("No token provided");
    }
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    if (!decoded || !decoded.exp) {
      throw new Error("Token expired");
    }
    if (!decoded?.userId) {
      throw new Error("Invalid token");
    }

    const user = await User.findOne({ _id: decoded?.userId }).select([
      "-password",
      "-_id",
    ]);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    
    next();
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

export default verifyUser;

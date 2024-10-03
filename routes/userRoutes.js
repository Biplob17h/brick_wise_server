import express from "express";
import {
  userLogout,
  confirmUserVerifyToken,
  getAllUser,
  getUser,
  userLogin,
  updateUserProfile,
  changeUserPassword,
  userSignUpFirstStep,
  userSignUpSecondStep,
} from "../controllers/userControllers.js";
import verifyUser from "../utils/verifyUser.js";

const userRoute = express.Router();

// All Posts
userRoute.post("/signup/first", userSignUpFirstStep);
userRoute.post("/signup/second", userSignUpSecondStep);
userRoute.post("/login", userLogin);
userRoute.post("/logout", userLogout);

// All Gets
userRoute.get("/single", verifyUser, getUser);
userRoute.get("/all", getAllUser);
userRoute.get("/confirm/:token", confirmUserVerifyToken);

// All Updates
userRoute.patch("/update/profile", updateUserProfile);
userRoute.patch("/update/password", changeUserPassword);

export default userRoute;

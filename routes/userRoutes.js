import express from "express";
import {
  userLogout,
  getAllUser,
  getUser,
  userLogin,
  updateUserProfile,
  changeUserPassword,
  userSignUp,
  confirmUserEmail,
  resendConfirmEmail
} from "../controllers/userControllers.js";
import verifyUser from "../utils/verifyUser.js";

const userRoute = express.Router();

// All Posts
userRoute.post("/signup", userSignUp);
userRoute.post("/login", userLogin);
userRoute.post("/logout", userLogout);

// All Gets
userRoute.get("/single", verifyUser, getUser);
userRoute.get("/all", getAllUser);
userRoute.get("/confirm/:token", confirmUserEmail)
userRoute.get("/email", resendConfirmEmail)


// All Updates
userRoute.patch("/update/profile", updateUserProfile);
userRoute.patch("/update/password", changeUserPassword);

export default userRoute;

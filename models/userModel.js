import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: [8, "password should be at least 8 characters"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  status: {
    type: String,
    default: "inactive",
    enum: ["active", "inactive", "blocked"],
  },
  step: {
    type: Number,
    default: 1,
  },
  confirmToken: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    enum: ["male", "female", ""],
    default: "",
  },
  title: {
    type: String,
    enum: ["Dr.", "Prof", "Prof. Dr.", ""],
    default: "",
  },
  street: {
    type: String,
    default: "",
  },
  no: {
    type: String,
    default: "",
  },
  zipCode: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  political: {
    type: String,
    enum: ["yes", "no"],
    default: "no",
  },
  usTax: {
    type: String,
    enum: ["yes", "no"],
    default: "yes",
  },
  placeOfBirth: {
    type: String,
    default: "",
  },
  nationality: {
    type: String,
    default: "",
  },
  dateOfBirth: {
     type : String,
     default: "",
  },
  phone : {
    type: String,
    default: "",
  }
});

const User = mongoose.model("User", userSchema);

export default User;

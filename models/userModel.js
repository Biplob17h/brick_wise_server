import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    default: "",
    required: true,
  },
  lastName: {
    type: String,
    default: "",
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    minlength: [8, "password should be at least 8 characters"],
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  // status: {
  //   type: String,
  //   default: "inactive",
  //   enum: ["active", "inactive", "blocked"],
  // },
  
  gender: {
    type: String,
    enum: ["male", "female"],
    default: "male",
    required: true,
  },
  title: {
    type: String,
    enum: ["Dr.", "Prof", "Prof. Dr.", ""],
    default: "",
  },
  street: {
    type: String,
    default: "",
    required: true,
  },
  no: {
    type: String,
    default: "",
    required: true,
  },
  zipCode: {
    type: String,
    default: "",
    required: true,
  },
  city: {
    type: String,
    default: "",
    required: true,
  },
  country: {
    type: String,
    default: "",
    required: true,
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
    required: true,
  },
  nationality: {
    type: String,
    default: "",
    required: true,
  },
  dateOfBirth: {
     type : String,
     default: "",
     required: true,
  },
  phone : {
    type: String,
    default: "",
    required: true,
  }
});

const User = mongoose.model("User", userSchema);

export default User;

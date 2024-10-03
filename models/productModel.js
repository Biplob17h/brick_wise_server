import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    default: "",
  },
  photos: [
    {
      photoLink: {
        type: String,
      },
    },
  ],
  price: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: "",
  },
  userEmail: {
    type: String,
    required: true,
  },
  // you can add more fields as per your requirement.
});

const Product = mongoose.model("product", productSchema);

export default Product;

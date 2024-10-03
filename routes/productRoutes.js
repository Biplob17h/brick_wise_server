import express from "express";
import {
  addAProductPhoto,
  createAProduct,
  deleteAProduct,
  deleteAProductPhoto,
  updateAProduct,
} from "../controllers/productController.js";

const productRoute = express.Router();

productRoute.post("/create", createAProduct);

productRoute.patch("/update/:id", updateAProduct);
productRoute.patch("/update/photo/add/:id", addAProductPhoto);
productRoute.patch("/update/photo/delete/:id/:photoId", deleteAProductPhoto);

productRoute.delete("/delete/:id", deleteAProduct);

export default productRoute;

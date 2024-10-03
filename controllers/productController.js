import Product from "../models/productModel.js";

const createAProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      status: "success",
      data: { product },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const getAProduct = async (req, res) => {
  try {
    const product = await Product.findById({ _id: req.params.id });
    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }
    res.status(200).json({
      status: "success",
      product,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

const updateAProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    if (!updatedProduct) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }
    res.status(200).json({
      status: "success",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

const addAProductPhoto = async (req, res) => {
  try {
    const { photo } = req.body;
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }
    // add photo to product's photos array
    const newPhotos = [...product.photos, photo];
    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { photos: newPhotos } },
      { new: true }
    );

    // send response
    res.status(200).json({
      status: "success",
      updatedProduct,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const deleteAProductPhoto = async (req, res) => {
  try {
    // get product from database
    const product = await Product.findById({ _id: req.params.id });
    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }
    // filter out the photo to be deleted
    const photos = product.photos;
    const filteredPhotos = photos.filter(
      (photo) => photo._id.toString() !== req.params.photoId
    );
    console.log(req.params);

    // update the product's photos in the database
    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { photos: filteredPhotos } },
      { new: true }
    );

    // send response
    res.status(200).json({
      status: "success",
      updatedProduct,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const deleteAProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete({
      _id: req.params.id,
    });
    if (!deletedProduct) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }
    res.status(204).json({
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

export {
  createAProduct,
  getAProduct,
  updateAProduct,
  deleteAProduct,
  addAProductPhoto,
  deleteAProductPhoto,
};

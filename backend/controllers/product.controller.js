import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/product.model.js";

//FETCH ALL THE PRODUCTS
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});


//FETCH A SINGLEPRODUCT
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error({ message: "Product not found" });
  }
});

export { getProductById, getProducts };

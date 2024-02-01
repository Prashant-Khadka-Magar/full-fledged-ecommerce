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
//CREATE A PRODUCT -ADMIN ONLY
const createProduct = asyncHandler(async (req, res) => {
  try {
    const product = new Product({
      name: "Sample Name",
      price: 0,
      user: req.user._id,
      brand: "Sample brand",
      category: "Sample category",
      countInStock: 0,
      numReviews: 0,
      description: "Sample Description",
      image: "/images/sample.jpg",
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//UPDATE A PRODUCT -ADMIN ONLY
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    try {
      (product.name = name),
        (product.price = price),
        (product.description = description),
        (product.image = image),
        (product.brand = brand),
        (product.category = category),
        (product.countInStock = countInStock);

      const updateProduct = await product.save();
      res.json(updateProduct);
    } catch (error) {
      res.status(404).json({ error: "ERROR WHILE UPDATING PRODUCT" });
    }
  } else {
    res.status(404).json({ error: "PRODUCT NOT FOUND" });
  }
});

//UPDATE A PRODUCT -ADMIN ONLY
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.status(200).json({ message: "PRODUCT DELETED" });
  } else {
    res.status(404).json({ error: "RESOURCE NOT FOUND" });
  }
});

export {
  getProductById,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};

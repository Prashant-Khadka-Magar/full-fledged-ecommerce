import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

//-------GET ALL THE PRODUCTS--------//
const getProducts = asyncHandler(async (req, res) => {
  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;
  const brands = req.query.brand;
  const category = req.query.category;

  const pageSize = 2;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  // Query for filtering based on price
  const priceFilter = {};
  if (minPrice !== undefined) {
    priceFilter.$gte = parseFloat(minPrice);
  }
  if (maxPrice !== undefined) {
    priceFilter.$lte = parseFloat(maxPrice);
  }
  if (Object.keys(priceFilter).length !== 0) {
    keyword.price = priceFilter;
  }

  //--Filtering BASED ON BRAND AND CATEGORY -------//
  if (brands) {
    const brandsArray = brands.split(",");
    keyword.brand = { $in: brandsArray };
  }
  if (category) {
    keyword.category = category;
  }

  const keywordWithoutBrand = { ...keyword };
  delete keywordWithoutBrand.brand;

  //---FOR SORTING BASED ON PRICE AND REVIEWS----------//
  const sortQuery = {};
  if (req.query.sort === "bestMatch") {
    sortQuery.numReviews = -1;
  } else if (req.query.sort === "priceHighToLow") {
    sortQuery.price = -1;
  } else if (req.query.sort === "priceLowToHigh") {
    sortQuery.price = 1;
  }

  //---COUNT NUMBER OF AVAILABLE PRODUCTS ---------------//
  const count = await Product.countDocuments({ ...keyword });

  const products = await Product.find({ ...keyword })
    .sort(sortQuery)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  //---AVAILABLE BRANDS AND CATEGORIES ---------------//
  const uniqueBrands = await Product.distinct("brand", {
    ...keywordWithoutBrand,
  });
  const uniqueCategories = await Product.distinct("category", { ...keyword });
  console.log(keyword);

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    uniqueBrands,
    uniqueCategories,
    count,
  });
});

//GET FEATURED PRODUCTS
const getFeaturedProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true });

    if (!products) {
      res.status(500);
      throw new Error("Product not found");
    }

    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error({ message: error.message });
  }
});

//Search SUggestion || Auto Complete
const getSearchSuggestions = asyncHandler(async (req, res) => {
  try {
    const keyword = req.params.keyword
      ? { name: { $regex: req.params.keyword, $options: "i" } }
      : {};

    const suggestions = await Product.find({ ...keyword }).limit(5);

    res.status(200).json(suggestions);
  } catch (error) {
    res.status(404);
    throw new Error({ message: "ERROR FETCHING SEARCH SUGGESTION" });
  }
});

//FETCH A SINGLEPRODUCT
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//GET RELATED PRODUCTS
const getRelatedProductsById = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(404);
    throw new Error("ID not found");
  }
  const product = await Product.findById(req.params.id);

  if (product) {
    const relatedProduct = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4);

    res.status(200).json(relatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
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
  const {
    name,
    price,
    description,
    brand,
    category,
    countInStock,
    isFeatured,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ error: "PRODUCT NOT FOUND" });
  }

  try {
    let updatedImages = [];
    const imagePaths = req.files?.image;

    if (imagePaths) {
      for (const imagePath of imagePaths) {
        try {
          const uploadedImage = await uploadOnCloudinary(imagePath.path);
          updatedImages.push(uploadedImage.url);
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          return res
            .status(500)
            .json({ error: "ERROR UPLOADING IMAGE TO CLOUDINARY" });
        }
      }
    }

    product.name = name;
    product.price = price;
    product.description = description;
    product.image = updatedImages;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    product.isFeatured=isFeatured;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
});

//Delete A PRODUCT -ADMIN ONLY
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.status(200).json({ message: "PRODUCT DELETED" });
  } else {
    res.status(404);
    throw new Error("RESOURCE NOT FOUND");
  }
});

//CREATE A NEW REVIEW
const createProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }

      if (req.user.isAdmin) {
        res.status(400);
        throw new Error("Admin Can't review the product");
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
        avatar: req.user.avatar,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    res.status(404);
    throw new Error({ message: error.message });
  }
});

//REPLY TO THE REVIEW OF CUSTOMER
const replyToReview = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const reviewId = req.params.reviewId;
  const { adminReply } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const review = product.reviews.find(
      (review) => review._id.toString() === reviewId
    );
    if (!review) {
      res.status(404);
      throw new Error("Review not found");
    }

    if (review.reply) {
      res.status(404);
      throw new Error("Reply already exists");
    }

    review.reply = adminReply;
    await product.save();

    res.status(200).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
export {
  getProductById,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getSearchSuggestions,
  getRelatedProductsById,
  replyToReview,
  getFeaturedProducts,
};

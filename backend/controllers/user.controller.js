import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

//login user
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("PLEASE INPUT ALL THE FIELDS");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("USER NOT FOUND");
  }

  const isPasswordValid = await user.matchPassword(password);

  if (isPasswordValid) {
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid user credentials");
  }
});

//register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("PLEASE ENTER ALL THE FIELDS");
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("USER ALREADY EXIST");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error(" INVALID USER DATA");
  }
});

//logout user
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "LOGGED OUT SUCCESSFUL" });
});

//get own profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("USER NOT FOUND");
  }
});

//update own profile
const updateUserProfile = asyncHandler(async (req, res) => {

});

// get all the users -ADMIN ONLY
const getUsers = asyncHandler(async (req, res) => {
  res.send("get all users");
});

// get a  user by ID -ADMIN ONLY
const getUserById = asyncHandler(async (req, res) => {
  res.send("get  user by ID");
});

// delete a user -ADMIN ONLY
const deleteUser = asyncHandler(async (req, res) => {
  res.send("delete user profile");
});

// delete a user -ADMIN ONLY
const updateUser = asyncHandler(async (req, res) => {
  res.send("update user");
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};

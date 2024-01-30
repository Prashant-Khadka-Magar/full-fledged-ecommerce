import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/order.model.js";

//create new order
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No Order Items");
  } else {
    try {
      const order = new Order({
        orderItems: orderItems.map((x) => ({
          ...x,
          product: x._id,
          _id: undefined,
        })),
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();

      res.status(200).json(createdOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

//Get Logged In Users Orders
const getMyOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

//Get Logged In Users Orders
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Order Not Found");
  }
});

//Update Order to paid
const updateOrderToPaid = asyncHandler(async (req, res) => {
  res.send("Update Order To Paid");
});

//Update Order to paid -- ADMIN ONLY
const updateOrderTodelivered = asyncHandler(async (req, res) => {
  res.send("Update Order To Delivered");
});

//Update All  Orders-- ADMIN ONLY
const getOrders = asyncHandler(async (req, res) => {
  res.send("Get All Orders");
});

export {
  addOrderItems,
  getMyOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderTodelivered,
  getOrders,
};

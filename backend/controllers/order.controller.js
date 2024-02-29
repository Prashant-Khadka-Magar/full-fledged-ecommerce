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
    couponDiscount
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
        couponDiscount
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
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order Not found");
  }

  try {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(404);
    throw new Error("Error updating Order");
  }
});

//Update Order to paid -- ADMIN ONLY
const updateOrderTodelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } else { 
    res.status(404);
    throw new Error("Error updating Order");
  }
});

//Update All  Orders-- ADMIN ONLY
const getOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id name");
    res.status(200).json(orders);
  } catch (error) {
    res.status(404);
    throw new Error("Error Fetching Order");
  }
});

export {
  addOrderItems,
  getMyOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderTodelivered,
  getOrders,
};

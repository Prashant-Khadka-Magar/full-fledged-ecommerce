import React, { useEffect } from "react";
import CheckoutSteps from "../components/CheckoutSteps";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import { toast } from "react-toastify";
import { clearCart } from "../slices/cartSlice";

function PlaceOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const {
    cart,
    shipping_address,
    payment_method,
    total_price,
    shipping_fee,
    tax_price,
  } = useSelector((state) => state.cart);

  useEffect(() => {
    if (!shipping_address) {
      navigate("/shipping");
    } else if (!payment_method) {
      navigate("/payment");
    }
  }, [shipping_address, payment_method, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart,
        shippingAddress: shipping_address,
        paymentMethod: payment_method,
        itemsPrice: total_price,
        shippingPrice: shipping_fee,
        taxPrice: tax_price,
        totalPrice: total_price + shipping_fee + tax_price,
      }).unwrap();
      dispatch(clearCart());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };
  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <div className="flex justify-between">
        <div>
          <h1 className="text-xl font-bold">Shipping</h1>
          <div className="flex gap-x-1">
            <h2 className="text-lg font-bold">Address:</h2>
            <p>{shipping_address.address},</p>
            <p>{shipping_address.city},</p>
            <p>{shipping_address.postalCode},</p>
            <p>{shipping_address.country}</p>
          </div>
          <div className="flex gap-x-4 my-4">
            <h2 className="text-lg font-bold">Payment Method:</h2>
            <p>{payment_method}</p>
          </div>
          <div>
            <h2 className="text-lg font-bold">Order Items</h2>
            {cart.length === 0 ? (
              <div>Your Cart Is empty</div>
            ) : (
              cart.map((item) => (
                <div className="flex gap-x-6 border-t mt-2 pt-1" key={item._id}>
                  <div className="flex">
                    <img
                      src={item.image}
                      alt="order_item_image"
                      className="h-12"
                    />
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </div>
                  <div>
                    {item.price} X {item.amount} = {item.amount * item.price}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div>
          <h1 className="font-bold text-md">Order Summary</h1>
          <div className="shadow-xl p-2">
            <span className="flex gap-x-2">
              <p>Items:</p>
              <p>{total_price}</p>
            </span>
            <span className="flex gap-x-2">
              <p>Tax:</p>
              <p>{tax_price}</p>
            </span>
            <span className="flex gap-x-2">
              <p>Shipping:</p>
              <p>{shipping_fee}</p>
            </span>
            <span className="flex gap-x-2">
              <p>Grand Total:</p>
              <p>{shipping_fee + tax_price + total_price}</p>
            </span>
            <button
              className="mt-2"
              disabled={cart.length === 0}
              onClick={placeOrderHandler}
            >
              {!isLoading ? <p>Place Order</p> : <Loader />}
            </button>
            {error && toast.error(error)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;

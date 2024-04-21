import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import {
  useGetOrderDetailsQuery,
  useGetPayPalClientIdQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
} from "../slices/ordersApiSlice";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function Order() {
  const { id: orderId } = useParams();
  const {
    data: order,
    isLoading,
    refetch,
    isError,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPayPalClientIdQuery();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPay, errorPayPal]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  }
  async function onApproveTest() {
    await payOrder({ orderId, details: { payer: {} } });
    refetch();
    toast.success("Payment successful");
  }
  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  const deliverHandler =async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success('Order Delivered')
    } catch (error) {
      toast.error(error?.data?.message || error.message)
    }
  };
  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <h1>{isError}</h1>;
  }

  return (
    <div>
      <h1 className="text-lg font-bold">Order No:{order._id}</h1>
      <div className="flex justify-between">
        <div className="flex flex-col gap-y-2 ">
          <span className="flex gap-x-2">
            <p>Name:</p>
            <p>{order.user.name}</p>
          </span>
          <span className="flex gap-x-2">
            <p>Email:</p>
            <p>{order.user.email}</p>
          </span>
          <span className="flex gap-x-2">
            <p>Address:</p>
            <p>
              {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
              {order.shippingAddress.postalCode},{" "}
              {order.shippingAddress.country}
            </p>
          </span>
          {order.isDelivered ? (
            <h1 className="bg-blue-500">Delivered On {order.deliveredAt}</h1>
          ) : (
            <h1 className="bg-red-400 text-white">Not Delivered</h1>
          )}
          <div>
            <p>
              <span>Payment Method:</span>
              <span>{order.paymentMethod}</span>
            </p>
            <div>
              {order.isPaid ? (
                <h1 className="bg-blue-500">Paid On {order.paidAt}</h1>
              ) : (
                <h1 className="bg-red-400 text-white">Not Paid</h1>
              )}
            </div>
            {order.orderItems.map((item) => (
              <div className="flex gap-x-6 border-t mt-2 pt-1" key={item._id}>
                <div className="flex">
                  <img
                    src={item.image[0]}
                    alt="order_item_image"
                    className="h-12"
                  />
                  <Link to={`/product/${item._id}`}>{item.name}</Link>
                </div>
                <div>
                  {item.price} X {item.amount} = {item.amount * item.price}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h1 className="font-bold text-md">Order Summary</h1>
          <div className="shadow-xl p-2">
            <span className="flex gap-x-2">
              <p>Items:</p>
              <p>{order.itemsPrice}</p>
            </span>
            <span className="flex gap-x-2">
              <p>Tax:</p>
              <p>+{order.taxPrice}</p>
            </span>
            <span className="flex gap-x-2">
              <p>Shipping:</p>
              <p>+{order.shippingPrice}</p>
            </span>
            <span className="flex gap-x-2">
              <p>Coupon Discount:</p>
              <p>-{order.couponDiscount}</p>
            </span>
            <span className="flex gap-x-2">
              <p>Grand Total:</p>
              <p>{order.totalPrice}</p>
            </span>
            {!order.isPaid && (
              <div>
                {loadingPay && <Loader />}
                {isPending ? (
                  <Loader />
                ) : (
                  <div>
                    {/* <div>
                      <button onClick={onApproveTest}>Test Pay</button>
                    </div> */}
                    <div>
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      ></PayPalButtons>
                    </div>
                  </div>
                )}
              </div>
            )}

            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <button type="button" onClick={deliverHandler}>
                  {!loadingDeliver ? "Deliver" : <Loader />}
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Order;

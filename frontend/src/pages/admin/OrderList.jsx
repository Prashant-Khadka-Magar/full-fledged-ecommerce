import React from "react";
import { useGetOrdersQuery } from "../../slices/ordersApiSlice";
import Loader from "../../components/Loader";
import {Link} from 'react-router-dom'

function OrderList() {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  console.log(orders);
  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return <h1>{error}</h1>;
  }
  return (
    <>
      <h1 className="font-bold text-xl text-center">ORDERS</h1>
      <table className="border border-collapse w-full">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">USER</th>
            <th className="border p-2">DATE</th>
            <th className="border p-2">TOTAL</th>
            <th className="border p-2">PAID</th>
            <th className="border p-2">DELIVERED</th>
            <th className="border p-2"></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="border p-2">{order._id}</td>
              <td className="border p-2">{order.user && order.user.name}</td>
              <td className="border p-2">{order.createdAt.substring(0, 10)}</td>
              <td className="border p-2">{(order.totalPrice).toFixed(2)}</td>
              <td className="border p-2">
                {order.isPaid ? (
                  order.paidAt.substring(0, 10)
                ) : (
                  <p>🔎</p>
                )}
              </td>
              <td className="border p-2">
                {order.isDelivered ? (
                  order.deliveredAt.substring(0, 10)
                ) : (
                  <p className="text-red-500 font-semibold">X</p>
                )}
              </td>
              <td>
                <Link to={`/order/${order._id}`}>
                  <button>
                    Details
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default OrderList;

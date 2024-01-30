import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../components/Loader";
import { useProfileMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";
import {Link} from 'react-router-dom'

function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const dispatch = useDispatch();
  const [updateProfile, { isLoading: loadingUpdateProdile }] =
    useProfileMutation();
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo, userInfo.name, userInfo.email]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error("Passwords do not match");
    }

    try {
      const res = await updateProfile({
        _id: userInfo._id,
        name,
        email,
        password,
      }).unwrap();
      dispatch(setCredentials(res));
      toast.success("PROFILE updated successfully");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <div className="flex justify-between">
      <div>
        <h2>User Profile</h2>
        <form onSubmit={submitHandler} className="flex flex-col gap-y-2">
          <input
            type="text"
            value={name}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            value={email}
            placeholder="E-Mail"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            value={password2}
            placeholder="Confirm Password"
            onChange={(e) => setPassword2(e.target.value)}
          />
          <button type="submit">
            {!loadingUpdateProdile ? "Submit" : <Loader />}
          </button>
        </form>
      </div>
      <div>
        <h1>My Orders</h1>
        {isLoading ? (
          <Loader />
        ) : error ? (
          toast.error(error.message)
        ) : (
          <table>
            <thead>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>{order.isPaid ? order.paidAt.substring(0, 10) : "🔎"}</td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <p className="text-red-500 font-bold">X</p>
                    )}
                  </td>
                  <td>
                    <Link to={`/order/${order._id}`}>
                      <button>Details</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Profile;

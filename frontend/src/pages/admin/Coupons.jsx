import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateCouponCodeMutation,
  useDeleteCouponMutation,
  useGetAllCouponsQuery,
} from "../../slices/couponApiSlice";
import Loader from "../../components/Loader";

function Coupons() {
  const [name, setName] = useState("");
  const [expireyDate, setExpireyDate] = useState(new Date());
  const [discountAmount, setDiscountAmount] = useState(0);
  const today = new Date();

  const { data, isLoading, isError } = useGetAllCouponsQuery();
  const [createCouponCode, { isLoading: couponLoading }] =
    useCreateCouponCodeMutation();
  const [deleteCoupon, { isLoading: deleteLoading }] =
    useDeleteCouponMutation();

  const createCoupon = async (e) => {
    e.preventDefault();

    if (name.trim() === "" || discountAmount <= 0) {
      toast.error("Please enter properly");
      return;
    }
    if (expireyDate < new Date()) {
      toast.error("Please enter the date later than today");
      return;
    }

    try {
      await createCouponCode({
        name,
        expiresIn: expireyDate,
        discount: discountAmount,
      });
      toast.success("Coupon created successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteHandler = (id) => {
    deleteCoupon(id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  return (
    <div className="flex  flex-col items-center">
      <button>Create Coupon</button>
      <form className="flex flex-col gap-y-2" onSubmit={createCoupon}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          value={discountAmount}
          onChange={(e) => setDiscountAmount(e.target.value)}
        />
        <input
          type="Date"
          value={expireyDate}
          onChange={(e) => setExpireyDate(e.target.value)}
        />
        <button type="submit">{couponLoading ? <Loader /> : "Create"}</button>
      </form>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <h1>Something went wrong</h1>
      ) : (
        <h1>
          {data.length > 0 &&
            data.map((coupon) => (
              <div
                key={coupon._id}
                className="flex items-center justify-between gap-x-2 mt-4 font-bold p-2 coupon"
              >
                <div>
                  <h1>COUPON CODE:{coupon.name}</h1>
                  <h1>Discount Amount:${coupon.discount}</h1>
                  <h1>Expire On:{formatDate(coupon.expiresIn)}</h1>
                </div>
                <button
                  className="bg-red-500"
                  onClick={() => deleteHandler(coupon._id)}
                >
                  {deleteLoading ? <Loader /> : "🗑"}
                </button>
              </div>
            ))}
        </h1>
      )}
    </div>
  );
}

export default Coupons;

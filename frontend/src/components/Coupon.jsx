import React, { useState } from "react";
import axios from "axios";
import { COUPON_URL } from "../constants";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { applyCoupon } from "../slices/cartSlice";

function Coupon() {
  const [couponCode, setCouponCode] = useState("");
  const dispatch = useDispatch();

  async function checkCoupon() {
    try {
      const res = await axios.post(`${COUPON_URL}/apply`, {
        name: couponCode,
      });
      const discountAmount = res.data.discount;
      dispatch(applyCoupon(discountAmount));
      toast('Coupon applied')
    } catch (error) {
      console.log(error.response.data.message);
      toast(error.response.data.message);
    }
  }

  const submitHandler = (e) => {
    e.preventDefault();
    checkCoupon();
  };
  return (
    <div className="flex justify-end mt-4 mr-4">
      <form onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="enter Coupan"
          onChange={(e) => setCouponCode(e.target.value)}
          value={couponCode}
        />
        <button type="submit">Apply</button>
      </form>
    </div>
  );
}

export default Coupon;

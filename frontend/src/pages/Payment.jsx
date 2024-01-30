import React, { useEffect, useState } from "react";
import CheckoutSteps from "../components/CheckoutSteps";

import { savePaymentMethod } from "../slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("Paypal");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { shipping_address } = useSelector((state) => state.cart);

  useEffect(() => {
    if (!shipping_address) {
      navigate("/shipping");
    }
  }, [shipping_address]);

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };
  return (
    <div>
      <CheckoutSteps step1 step2 step3 />
      <form onSubmit={submitHandler}>
        <input
          type="radio"
          name="payment"
          id="paypal"
          value="Paypal"
          checked={paymentMethod === "Paypal"}
          onChange={handlePaymentChange}
        />
        <label htmlFor="paypal">Paypal</label>
        <input
          type="radio"
          name="payment"
          id="visa"
          value="Visa"
          checked={paymentMethod === "Visa"}
          onChange={handlePaymentChange}
        />
        <label htmlFor="visa">Visa</label>
        <button type="submit">Continue</button>
      </form>
    </div>
  );
}

export default Payment;

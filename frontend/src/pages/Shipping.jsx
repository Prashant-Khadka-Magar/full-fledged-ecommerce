import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../slices/cartSlice";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";

function Shipping() {
  const { shipping_address } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shipping_address?.address || "");
  const [city, setCity] = useState(shipping_address?.city || "");
  const [postalCode, setPostCode] = useState(
    shipping_address?.postalCode || ""
  );
  const [country, setCountry] = useState(shipping_address?.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();

    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/payment");
  };
  return (
    <div>
      <CheckoutSteps step1 step2/> 
      <form
        onSubmit={submitHandler}
        className="flex flex-col gap-y-2 items-center"
      >
        <input
          type="text"
          placeholder="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="postalCode"
          value={postalCode}
          onChange={(e) => setPostCode(e.target.value)}
        />
        <input
          type="text"
          placeholder="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <button type="submit">Continue</button>
      </form>
    </div>
  );
}

export default Shipping;

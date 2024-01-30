import React from "react";
import { Link } from "react-router-dom";

function CheckoutSteps({ step1, step2, step3, step4 }) {
  return (
    <ul className="flex gap-x-4 justify-center my-2 font-bold">
      <li>
        {step1 ? (
          <Link to="/login">Sign In</Link>
        ) : (
          <Link className="text-gray-400">Sign In</Link>
        )}
      </li>
      <li>
        {step2 ? (
          <Link to="/shipping">Shipping</Link>
        ) : (
          <Link className="text-gray-400">Shipping</Link>
        )}
      </li>
      <li>
        {step3 ? (
          <Link to="/payment">Payment</Link>
        ) : (
          <Link className="text-gray-400">Payment</Link>
        )}
      </li>
      <li>
        {step4 ? (
          <Link to="/placeorder">Place Order</Link>
        ) : (
          <Link className="text-gray-400">Place Order</Link>
        )}
      </li>
    </ul>
  );
}

export default CheckoutSteps;

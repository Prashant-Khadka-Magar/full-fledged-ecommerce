import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <ul className="bg-basecolor flex justify-between text-white sm:px-2 sm:text-lg font-bold border-t p-4 ">
      <li>
        <NavLink
          to="/"
          className={({ isActive }) => `${isActive && "text-green-500"} `}
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/products"  className={({ isActive }) => `${isActive && "text-green-500"} `}>All Products</NavLink>{" "}
      </li>
    </ul>
  );
}

export default Navbar;

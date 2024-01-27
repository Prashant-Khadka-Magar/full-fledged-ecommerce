import React from "react";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
function Header() {
  const { total_items } = useSelector(
    (state) => state.cart
  );
  return (
    <div className="bg-basecolor flex justify-between text-white sm:px-2 sm:text-lg font-bold">
      <NavLink to='/'>
      <img
        loading="lazy"
        src="https://icms-image.slatic.net/images/ims-web/e6ac6883-1158-4663-bda4-df5a1aa066e5.png"
        alt="app_logo"
        className="h-12 max-md:h-8"
      />
      
      </NavLink>
      <div className="flex items-center sm:gap-x-4">
        <NavLink to='/cart' className="flex items-center">
          <FaShoppingCart /> Cart <p className="text-xs border rounded-full bg-white text-basecolor">{total_items}</p>
        </NavLink>
        <NavLink to='/login' className="flex items-center">
          <FaUser /> Sign In
        </NavLink>
      </div>
    </div>
  );
}

export default Header;

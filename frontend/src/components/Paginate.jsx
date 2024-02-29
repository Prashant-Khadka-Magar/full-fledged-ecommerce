import React from "react";
import { Link } from "react-router-dom";

function Paginate({ pages, page, isAdmin = false, keyword = "" }) {
  return (
    pages > 1 && (
      <div>
        {[...Array(pages).keys()].map((x) => (
          <Link
            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/page/${x + 1}`
                  : `/page/${x + 1}`
                : `/admin/productlist/${x + 1}`
            }
            key={x + 1}
          >
            <button className={x + 1 === page ? "bg-red-500" : "bg-gray-500"}>
              {x + 1}
            </button>
          </Link>
        ))}
      </div>
    )
  );
}

export default Paginate;

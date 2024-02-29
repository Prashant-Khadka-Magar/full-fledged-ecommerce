import React from "react";
import { Link } from "react-router-dom";

function UsersPagination({ pages, page }) {
  return (
    pages > 1 && (
      <div>
        {[...Array(pages).keys()].map((x) => (
          <Link
            to={`/admin/userlist/${x + 1}`}
            key={x + 1}
          >
            <button className={x + 1 === page ? "bg-red-500" : "bg-green-500"}>
              {x + 1}
            </button>
          </Link>
        ))}
      </div>
    )
  );
}

export default UsersPagination;

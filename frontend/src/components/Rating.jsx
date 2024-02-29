import React from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

function Rating(star) {
  let fullStar = Math.floor(star);
  let halfStar = star % 1 >= 0.5 ? 1 : 0;
  let emptyStar = Math.ceil(5 - fullStar - halfStar);

  return (
    <div className="flex">
      {Array.from({ length: fullStar }, (_, idx) => (
        <FaStar key={`full-${idx}`} className="inline-flex text-red-500" />
      ))}
      {Array.from({ length: halfStar }, (_, idx) => (
        <FaStarHalfAlt key={`half-${idx}`} className="inline-flex text-red-500" />
      ))}
      {Array.from({ length: emptyStar }, (_, idx) => (
        <FaRegStar key={`empty-${idx}`} className="inline-flex" />
      ))}

    </div>
  );
}

export default Rating;

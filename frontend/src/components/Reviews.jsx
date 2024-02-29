import React, { useState } from "react";
import Rating from "./Rating";

function Reviews({ reviews }) {
  const reviewPerPage = 2;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastReview = currentPage * reviewPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewPerPage;
  const reviewsToShow = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const totalPage = Math.ceil(reviews.length / reviewPerPage);

  return (
    <div className="my-6">
      {reviewsToShow.map((review) => (
        <div key={review._id} className="border-t pt-4">
          <div className="flex">
            <span>
              <img src={review.avatar} alt="reviewer_img" className="h-12" />
            </span>
            <div className="flex flex-col">
              <span className="font-bold">{review.name}</span>
              <span>{Rating(review.rating)}</span>
              <span className="text-xs">
                {review.createdAt.substring(0, 10)}
              </span>
              <span className="font-semibold">{review.comment}</span>
            </div>
          </div>
        </div>
      ))}

      <div>
        {reviews.length >reviewPerPage && Array.from({ length: totalPage }).map((_, idx) => (
          <button
          key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            className={`${idx + 1 === currentPage ? 'bg-red-500' : 'bg-gray-500'}`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Reviews;

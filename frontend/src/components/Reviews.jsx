import React, { useEffect, useState } from "react";
import Rating from "./Rating";
import { toast } from "react-toastify";
import { useReplyToReviewMutation } from "../slices/productsApiSlice";
import { useSelector } from "react-redux";
import Loader from "./Loader";

function Reviews({ reviews, productId }) {
  const { userInfo } = useSelector((state) => state.auth);

  const [replyBox, setReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [reviewId, setReviewId] = useState(null);

  const [replyToReview, { isLoading }] =
    useReplyToReviewMutation();
  //Pagination
  const reviewPerPage = 2;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastReview = currentPage * reviewPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewPerPage;
  const reviewsToShow = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const totalPage = Math.ceil(reviews.length / reviewPerPage);

  const replyBoxHandler = (id) => {
    setReplyBox(true);
    setReviewId(id);
  };

  const replyHandler = async (e) => {
    e.preventDefault();
    if (!reviewId) {
      toast.error("Please select a review");
      return;
    }
    if (replyText.trim() === "") {
      toast.error("Please enter a reply");
      return;
    }
    try {
      let reply = {
        adminReply: replyText,
      };
      await replyToReview({ productId, reviewId, reply }).unwrap();
      toast.success("Replied successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

 

  return (
    <div className="my-6">
      {reviewsToShow.map((review) => (
        <div key={review._id} className="border-t">
          <div className=" pt-4">
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
          {review.reply && (
            <div className="bg-gray-300 p-2 pl-4">
              <h1 className="text-orange-500">Seller</h1>
              <h1 className="pl-2">{review.reply}</h1>
            </div>
          )}
          {userInfo.isAdmin && (
            <button onClick={() => replyBoxHandler(review._id)}>reply</button>
          )}
        </div>
      ))}
      {replyBox && (
        <div>
          <span onClick={() => setReplyBox(false)} className="cursor-pointer">
            ❌
          </span>
          <form onSubmit={replyHandler}>
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <button>{isLoading ? <Loader /> : "OK"}</button>
          </form>
        </div>
      )}
      <div>
        {reviews.length > reviewPerPage &&
          Array.from({ length: totalPage }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`${
                idx + 1 === currentPage ? "bg-red-500" : "bg-gray-500"
              }`}
            >
              {idx + 1}
            </button>
          ))}
      </div>
    </div>
  );
}

export default Reviews;

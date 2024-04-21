import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Rating from "../components/Rating";
import {
  useCreateReviewMutation,
  useGetProductsDetailsQuery,
  useGetRelatedProductsQuery,
} from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import { toast } from "react-toastify";
import ProductImages from "../components/ProductImage";
import Reviews from "../components/Reviews";
import RelatedProduct from "../components/RelatedProduct";

function ProductDetail() {
  const { id: productId } = useParams();
  const [amount, setAmount] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [dataLoading,setDataLoading]=useState(false);

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductsDetailsQuery(productId);
  const { data: relatedProduct, isLoading: relatedLoading } =
    useGetRelatedProductsQuery(productId);

  useEffect(()=>{
    setDataLoading(true);
  },[productId])


  const [
    createReview,
    { isLoading: loadingProductReview, isError, error: errorReview },
  ] = useCreateReviewMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (product?.countInStock > 0) {
      setAmount(1);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    setDataLoading(false)
  }, [product]);

  const dispatch = useDispatch();

  const increaseAmt = () => {
    if (amount >= product.countInStock) {
      return;
    }
    setAmount((prev) => prev + 1);
  };
  const decreaseAmt = () => {
    if (amount <= 1) {
      return;
    }
    setAmount((prev) => prev - 1);
  };

  const addTocartHandler = () => {
    dispatch(addToCart({ product: product, amount: amount }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (isError) {
      toast.error(errorReview.message);
    }

    if (rating === 0 || comment.trim().length === 0) {
      toast.error("Please enter a valid rating and comment");
      return;
    }

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();

      refetch();
      toast.success("Reviewed successfully");
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error?.data?.messsage || error.messsage);
    }
  };
  if (isLoading || dataLoading) {
    return (
      <h1 className="flex h-screen justify-center items-center text-2xl">
        <Loader />
      </h1>
    );
  }
  if (error) {
    return (
      <h1 className="flex h-screen justify-center items-center text-2xl">
        Something Went Wrong
      </h1>
    );
  }
  return (
    <div>
      <Link to="/">Go Back</Link>
      <div>
        {product && product.image && <ProductImages images={product.image} />}

        <div className="flex flex-col">
          <span>{product.name}</span>
          <span className="flex items-center gap-x-2">
            {Rating(product.rating)}
            <p>{product.numReviews} reviews</p>
          </span>
          <span>$ {product.price}</span>
          <span>{product.description}</span>
        </div>
        <div className="shadow-xl m-2 flex flex-col p-2 gap-y-1">
          <span>
            Status: {product.countInStock > 0 ? "In stock" : "Out Of Stock"}
          </span>
          <div className="flex gap-x-2">
            <span className="flex gap-x-4">
              <button
                onClick={decreaseAmt}
                className="bg-black text-white px-2"
              >
                -
              </button>
              <p>{amount}</p>
              <button
                onClick={increaseAmt}
                className="bg-black text-white px-2 "
              >
                +
              </button>
            </span>
            <button
              className={`${
                product.countInStock > 0 ? "bg-blue-500" : "bg-slate-500"
              }`}
              disabled={product.countInStock === 0}
              onClick={addTocartHandler}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
      <div>
        <h1>Reviews</h1>
        {product.reviews.length === 0 ? (
          <div>No Reviews</div>
        ) : (
          <Reviews reviews={product.reviews} productId={productId} />
        )}
        <div>
          {userInfo ? (
            <>
              <h2>Write a review</h2>
              <form onSubmit={submitHandler}>
                <select
                  name=""
                  id=""
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  <option value="0" disabled defaultValue>
                    Choose Rating
                  </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="enter your views in the product"
                />
                <button type="submit">
                  {!loadingProductReview ? "Submit" : <Loader />}
                </button>
              </form>
            </>
          ) : (
            <h1>Login to Review</h1>
          )}
        </div>
      </div>
      {!relatedLoading && <RelatedProduct products={relatedProduct} />}
    </div>
  );
}

export default ProductDetail;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Rating from "../components/Rating";
import { useGetProductsDetailsQuery } from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";

function ProductDetail() {
  const { id: productId } = useParams();
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductsDetailsQuery(productId);

  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (product?.countInStock > 0) {
      setAmount(1);
    }
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

  if (isLoading) {
    return (
      <h1 className="flex h-screen justify-center items-center text-2xl">
        {" "}
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
        {product.image && product.image && (
          <img src={product.image} alt="single_img" className="h-18" />
        )}

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
    </div>
  );
}

export default ProductDetail;

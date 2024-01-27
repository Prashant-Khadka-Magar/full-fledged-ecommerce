import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Rating from "../components/Rating";
import { useGetProductsDetailsQuery } from "../slices/productsApiSlice";
import Loader from "../components/Loader";

function ProductDetail() {
  const { id: productId } = useParams();

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductsDetailsQuery(productId);

  if (isLoading) {
    return <h1 className="flex h-screen justify-center items-center text-2xl"> <Loader/></h1>;
  }
  if (error) {
    return <h1  className="flex h-screen justify-center items-center text-2xl">Something Went Wrong</h1>;
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
          <div>
            <button
              className={`${
                product.countInStock > 0 ? "bg-blue-500" : "bg-slate-500"
              }`}
              disabled={product.countInStock === 0}
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

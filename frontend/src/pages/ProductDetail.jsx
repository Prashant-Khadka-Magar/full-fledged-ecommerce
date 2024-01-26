import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Rating from "../components/Rating";
import axios from "axios";

function ProductDetail() {
  const [product, setProduct] = useState([]);
  const { id: productId } = useParams();

  const fetchProduct = async () => {
    const { data } = await axios.get(`/api/products/${productId}`);
    setProduct(data);
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);
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

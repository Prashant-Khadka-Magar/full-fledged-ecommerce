<!-- 
import React, { useEffect, useState } from "react";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import { Link, useParams } from "react-router-dom";

function Home() {
  const { keyword, sort } = useParams();
  const [pageNumber, setPageNumber] = useState(1);
  const [products, setProducts] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
    sort,
  });
  

  useEffect(() => {
    if (data && data.products) {
      if (data.products.length === 0) {
        setHasEnded(true); 
      } else {
        setProducts((prev) => [...prev, ...data.products]);
        setIsLoadingMore(false);
      }
    }
  }, [data]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
        if (
          scrollHeight - scrollTop === clientHeight &&
          !isLoadingMore &&
          !hasEnded
        ) {
          console.log("Reached end of page or near the end.");
          setIsLoadingMore(true);
          setPageNumber((prev) => prev + 1);
        }
        
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //---------------DOM------------------//
  if (isLoading) {
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
      {keyword && (
        <Link to="/">
          <button>Go Back</button>
        </Link>
      )}

      <div>
        {products.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
      {isLoadingMore && !hasEnded && <Loader />}
      {hasEnded && <p>No more products to load.</p>}
    </div>
  );
}

export default Home; -->

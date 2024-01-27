import React from "react";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Loader from "../components/Loader";

function Home() {
  const { data: products, isLoading, error } = useGetProductsQuery();

  if (isLoading) {
    return <h1 className="flex h-screen justify-center items-center text-2xl"> <Loader/></h1>;
  }
  if (error) {
    return <h1  className="flex h-screen justify-center items-center text-2xl">Something Went Wrong</h1>;
  }

  return (
    <div>
      <div>
        {products.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
     
    </div>
  );
}

export default Home;

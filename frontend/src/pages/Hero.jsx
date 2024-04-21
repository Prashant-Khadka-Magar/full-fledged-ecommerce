import React from "react";
import { useGetFeaturedProductsQuery } from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Product from "../components/Product";

function Hero() {
  const { data, isLoading, error, isError } = useGetFeaturedProductsQuery();

  if(isLoading){
    return <Loader />
  }
  if(isError){
    return <h1>{error}</h1>
  }
  return <div>
    <h1 className="text-xl font-bold text-center">FEATURED PRODUCTS</h1>
    {
      data.map((product)=>(
        <Product key={product._id} product={product} />
      ))
    }
  </div>;
}

export default Hero;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Product from "../components/Product";
function Home() {
  const [products, setProducts]=useState([])

  const fetchProducts=async ()=>{
    const {data}=await axios.get('/api/products');
    setProducts(data);
  }

  useEffect(()=>{
    fetchProducts()
  },[])
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

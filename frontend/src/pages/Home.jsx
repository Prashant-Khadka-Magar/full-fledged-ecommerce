import React from "react";
import { products } from "../Products";
import Product from "../components/Product";
function Home() {
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

// Home.jsx
import React, { useEffect, useState } from "react";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import { Link, useNavigate, useParams } from "react-router-dom";
import Paginate from "../components/Paginate";

function Home() {
  const { pageNumber, keyword, sort } = useParams();
  const [sortValue, setSortValue] = useState(0);
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
    sort
  });

  const sortingHandler = (e) => {
    const newSortValue = e.target.value;
    // Preserve existing values for pageNumber and keyword
    const newUrl = `/sort/${newSortValue}${keyword ? `/search/${keyword}` : ''}${pageNumber ? `/page/${pageNumber}` : ''}`;
    
    setSortValue(newSortValue);
    navigate(newUrl);
  };
  


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
        <select value={sortValue} onChange={sortingHandler}>
          <option value="0" disabled defaultValue>Sort</option>
          <option value="bestMatch">Most Reviewed</option>
          <option value="priceLowToHigh">Low To High</option>
          <option value="priceHighToLow">High To Low</option>
        </select>
      </div>
      <div>
        {data.products.map((product) => (
          <Product key={product._id} product={product} />
        ))}
        <Paginate
          page={data.page}
          pages={data.pages}
          keyword={keyword ? keyword : ""}
        />
      </div>
    </div>
  );
}

export default Home;

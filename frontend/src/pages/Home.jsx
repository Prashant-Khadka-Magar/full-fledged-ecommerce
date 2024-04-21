import React, { useEffect, useState } from "react";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { nanoid } from "@reduxjs/toolkit";

function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keywordFromUrl = searchParams.get("q");
  const sortFromUrl = searchParams.get("sort");
  const pageFromUrl = searchParams.get("page");
  const minFromUrl = searchParams.get("min");
  const maxFromUrl = searchParams.get("max");
  const [sortValue, setSortValue] = useState(sortFromUrl || "0");
  const [keyword, setKeyword] = useState(keywordFromUrl || "");
  const [minPrice, setMinPrice] = useState(minFromUrl || 0);
  const [maxPrice, setMaxPrice] = useState(maxFromUrl || 0);
  const [brand, setBrand] = useState([]);
  const [category, setCategory] = useState(undefined);
  const [dataLoading, setDataLoading] = useState(false);

  const { data, isLoading, error, isError } = useGetProductsQuery({
    keyword: keywordFromUrl || "",
    pageNumber: pageFromUrl || 1,
    sort: sortFromUrl || undefined,
    minPrice: minFromUrl || undefined,
    maxPrice: maxFromUrl || undefined,
    brand,
    category,
  });

  const searchHandler = (e) => {
    e.preventDefault();
    clearFilterHandler();
    navigate(`?q=${keyword}`);
  };

  const sortingHandler = (e) => {
    const value = e.target.value;
    setSortValue(value);
    navigate(
      `?q=${keyword}&sort=${value}${
        minFromUrl ? `&min=${minFromUrl}&max=${maxFromUrl}` : ""
      }`
    );
  };

  const priceHandler = (e) => {
    e.preventDefault();
    navigate(`?q=${keyword}&sort=${sortValue}&min=${minPrice}&max=${maxPrice}`);
  };

  const brandFilterHandler = (brandName) => {
    if (brand.includes(brandName)) {
      return;
    }
    setBrand((prev) => [...prev, brandName]);
  };

  const categoryFilterHandler = (categoryName) => {
    setCategory(categoryName);
  };

  useEffect(() => {
    setDataLoading(true); 
  }, [
    keywordFromUrl,
    sortFromUrl,
    pageFromUrl,
    minFromUrl,
    maxFromUrl,
    brand,
    category,
  ]);

  // Reset loading state to false when data is fetched
  useEffect(() => {
    if (data) {
      setDataLoading(false);
    }
  }, [data]);

  const clearFilterHandler = () => {
    setSortValue("0");
    setBrand([]);
    setCategory(undefined);
    setMaxPrice(0);
    setMinPrice(0);
    navigate(`?q=${keyword}&sort=0`);
  };

  const deleteBrandHandler = (name) => {
    let filtered = brand.filter((item) => item !== name);
    setBrand(filtered);
  };

  //---------------DOM------------------//
  if (isLoading) {
    return (
      <h1>
        <Loader />
      </h1>
    );
  }
  if (error) {
    return <h1>Something Went Wrong</h1>;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-center my-2 pagination-component"></div>

      <form onSubmit={searchHandler}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="submit">🔍</button>
      </form>
      <div>
        <select value={sortValue} onChange={sortingHandler}>
          <option value="0" disabled defaultValue>
            Sort
          </option>
          <option value="bestMatch">Most Reviewed</option>
          <option value="priceLowToHigh">Low To High</option>
          <option value="priceHighToLow">High To Low</option>
        </select>
      </div>
      <div className="flex justify-between">
        <ul>
          <li className="font-bold text-lg border-b">Brands</li>
          {data.uniqueBrands.map((brand, index) => (
            <li
              onClick={() => brandFilterHandler(brand)}
              key={index}
              className="cursor-pointer mt-1"
            >
              {brand}
            </li>
          ))}
        </ul>
        <ul>
          <li className="font-bold text-lg border-b">Categories</li>
          {data.uniqueCategories.map((category, index) => (
            <li
              onClick={() => categoryFilterHandler(category)}
              key={index}
              className="cursor-pointer mt-1"
            >
              {category}
            </li>
          ))}
        </ul>
      </div>
      <div>
        {brand &&
          brand.map((item) => {
            const id = nanoid();
            return (
              <button key={id} className="flex gap-x-2 cursor-default">
                <span>{item}</span>
                <span
                  className="cursor-pointer"
                  onClick={() => deleteBrandHandler(item)}
                >
                  ❌
                </span>
              </button>
            );
          })}
      </div>
      <form onSubmit={priceHandler}>
        <input
          type="number"
          placeholder="minPrice"
          onChange={(e) => setMinPrice(e.target.value)}
          value={minPrice}
        />
        <input
          type="number"
          placeholder="maxPrice"
          onChange={(e) => setMaxPrice(e.target.value)}
          value={maxPrice}
        />
        <button type="submit">Apply</button>
      </form>

      <div className="flex ">
        <button onClick={clearFilterHandler}>Clear Filter</button>
      </div>

      <h2 className="text-center">{data.count} Products Available</h2>

      <div>
        {dataLoading ? (
          <Loader />
        ) : isError ? (
          <h1>{error}</h1>
        ) : (
          data.products.map((product) => (
            <Product key={product._id} product={product} />
          ))
        )}
      </div>

      {data.pages > 1 && (
        <div>
          {[...Array(data.pages).keys()].map((x) => (
            <Link
              to={`?q=${keyword}&sort=${sortValue}${
                minFromUrl && `&min=${minFromUrl}&max=${maxFromUrl}`
              }&page=${x + 1}`}
              key={x + 1}
            >
              <button
                className={x + 1 === data.page ? "bg-red-500" : "bg-gray-500"}
              >
                {x + 1}
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;

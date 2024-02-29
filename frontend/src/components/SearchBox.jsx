import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetSearchSuggestionsQuery } from "../slices/productsApiSlice";

function SearchBox() {
  const navigate = useNavigate();
  const { keyword: urlkeyword } = useParams();
  const [keyword, setKeyword] = useState(urlkeyword || "");
  const { data, refetch } = useGetSearchSuggestionsQuery(keyword, {
    skip: keyword.trim() === "",
  });

  const inputChangeHandler = (e) => {
    setKeyword(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      navigate(`search/${keyword}`);
    } else {
      navigate("/");
    }
  };
  return (
    <div>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          onChange={inputChangeHandler}
          value={keyword}
          className="text-black"
        />
        <button type="submit">Search</button>
      </form>
      {data && keyword.trim() !== "" && (
        <ul>
          {data.map((item) => (
            <li key={item._id}>
              <Link to={`product/${item._id}`}>{item.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBox;

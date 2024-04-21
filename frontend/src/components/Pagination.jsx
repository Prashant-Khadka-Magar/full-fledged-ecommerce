// Pagination.jsx
import React from "react";
import ReactPaginate from "react-paginate";

function Pagination({ pagesNo, onPageChange }) {
  return (
    <ReactPaginate
      pageCount={pagesNo}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      previousLabel={"<<"}
      nextLabel={">>"}
      breakLabel={"..."}
      activeClassName={"bg-blue-500 text-white"}
      containerClassName={"flex gap-x-2"}
      pageClassName={
        "border rounded-full h-8 w-8 flex item-center justify-center"
      }
      previousClassName={
        "border rounded-full h-8 w-8 flex item-center justify-center"
      }
      nextClassName={
        "border rounded-full h-8 w-8 flex item-center justify-center"
      }
      onPageChange={(selected) => onPageChange(selected.selected + 1)}
    />
  );
}

export default Pagination;

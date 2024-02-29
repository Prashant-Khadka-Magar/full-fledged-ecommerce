import React, { useState } from "react";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from "../../slices/productsApiSlice";
import Loader from "../../components/Loader";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Paginate from "../../components/Paginate";

function ProductList() {
  const { pageNumber } = useParams();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const { data, isLoading, error, refetch } = useGetProductsQuery({
    keyword,
    pageNumber,
  });
  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();
  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const createProductHandler = async () => {
    if (window.confirm("Are you sure you want to create")) {
      try {
        let createdProduct = await createProduct();
        toast.success("Successfully Created");
        refetch();
        navigate(`/admin/product/${createdProduct.data._id}/edit`);
      } catch (error) {
        TransformStream.error(error?.data?.message || error.message);
      }
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete")) {
      try {
        await deleteProduct(id);
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    }
  };
  return (
    <>
      <form>
        <input
          type="text"
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
        />
      </form>
      <header className="flex justify-between">
        <h1>Products</h1>
        <button onClick={createProductHandler}>Create Product</button>
      </header>
      {isLoading ? (
        <Loader />
      ) : (
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((product) => (
              <tr key={product._id}>
                <td>
                  <img
                    src={product.image[0]}
                    alt="product_list_image"
                    className="h-12"
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <Link to={`/admin/product/${product._id}/edit`}>
                    <button>🖋</button>
                  </Link>
                  <button
                    onClick={() => deleteHandler(product._id)}
                    className="bg-red-500"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {data && <Paginate page={data.page} pages={data.pages} isAdmin={true} />}
      {loadingDelete && <Loader />}
      {loadingCreate && <Loader />}
    </>
  );
}

export default ProductList;

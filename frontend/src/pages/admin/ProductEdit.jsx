import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useUpdateProductMutation,
  useGetProductsDetailsQuery,
  useUploadProductImageMutation,
} from "../../slices/productsApiSlice";

function ProductEdit() {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [description, setDescription] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductsDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      productId,
      name,
      price,
      image,
      brand,
      category,
      countInStock,
      description,
    };

    const result = await updateProduct(updatedProduct);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Product Updated");
      refetch()
      navigate("/admin/productlist");
    }
  };

  const fileUploadHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
       const res = await uploadProductImage(formData).unwrap();
       toast.success(res.message);
       setImage(res.image);
    } catch (err) {
       console.error("Error uploading image:", err);
       toast.error(err?.data?.message || "Failed to upload image");
    }
 };
 

  return (
    <div>
      <Link to="/admin/productlist">
        <button>Go Back</button>
      </Link>
      <h1>Update Products</h1>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <h1>{error}</h1>
      ) : (
        <form
          onSubmit={submitHandler}
          className="flex flex-col gap-y-2 items-center"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="price"
          />
          <>
            {!image && <label>{product.image}</label>}
            <input
              type="file"
              // value={image}
              onChange={fileUploadHandler}
              placeholder="Image"
            />
            {loadingUpload && <Loader />}
          </>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Brand"
          />
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
          />
          <input
            type="number"
            value={countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
            placeholder="Stock Count"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Stock Count"
          />
          <button type="submit">
            {!loadingUpdate ? "Update" : <Loader />}
          </button>
        </form>
      )}
    </div>
  );
}

export default ProductEdit;

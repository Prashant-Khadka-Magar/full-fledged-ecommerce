import { PRODUCTS_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({
        keyword,
        pageNumber,
        sort,
        minPrice,
        maxPrice,
        brand,
        category,
      }) => ({
        url: PRODUCTS_URL,
        params: {
          keyword,
          pageNumber,
          sort,
          minPrice,
          maxPrice,
          brand,
          category,
        },
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),

    getSearchSuggestions: builder.query({
      query: (keyword) => ({
        url: `${PRODUCTS_URL}/suggestions/${keyword}`,
      }),
      keepUnusedDataFor: 5,
    }),

    getProductsDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: () => ({
        url: PRODUCTS_URL,
        method: "POST",
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: (formData) => ({
        url: `${PRODUCTS_URL}/${formData.get("productId")}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: UPLOAD_URL,
        method: "POST",
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "DELETE",
      }),
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    replyToReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews/${data.reviewId}/reply`,
        method: "POST",
        body: data.reply,
      }),
      invalidatesTags: ["Product"],
    }),
    getRelatedProducts: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}/related`,
      }),
    }),
    getFeaturedProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/featured`,
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductsDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetSearchSuggestionsQuery,
  useGetRelatedProductsQuery,
  useReplyToReviewMutation,
  useGetFeaturedProductsQuery
} = productsApiSlice;

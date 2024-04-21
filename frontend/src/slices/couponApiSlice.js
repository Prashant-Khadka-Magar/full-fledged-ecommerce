import { COUPON_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const couponApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCouponCode: builder.mutation({
      query: (data) => ({
        url: COUPON_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["COUPON"],
    }),
    getAllCoupons: builder.query({
      query: () => ({
        url: COUPON_URL,
      }),
      providesTags: ["COUPON"],
      keepUnusedDataFor: 5,
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `${COUPON_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["COUPON"],
    }),
  }),
});

export const {
  useCreateCouponCodeMutation,
  useGetAllCouponsQuery,
  useDeleteCouponMutation,
} = couponApiSlice;

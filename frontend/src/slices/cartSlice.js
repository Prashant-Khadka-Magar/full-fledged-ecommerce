import { createSlice } from "@reduxjs/toolkit";

const loadCartFromLocalStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart
    ? JSON.parse(storedCart)
    : {
        cart: [],
        total_items: 0,
        total_price: 0,
        shipping_address: {},
        payment_method: "PayPal",
        tax_price: 0,
        shipping_fee: 15,
        coupon_discount: 0,
      };
};

function saveCartToLocalStorage(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updatedTotals(state) {
  state.total_items = state.cart.reduce(
    (total, item) => total + item.amount,
    0
  );
  state.total_price = state.cart.reduce(
    (total, item) => total + item.price * item.amount,
    0
  );
}

const cartSlice = createSlice({
  name: "cart",
  initialState: loadCartFromLocalStorage(),
  reducers: {
    addToCart: (state, action) => {
      const { product, amount } = action.payload;

      let existing = state.cart.find((cart) => cart._id === product._id);

      if (existing) {
        state.cart = state.cart.map((item) => {
          if (item._id === product._id) {
            let addedAmount = amount + item.amount;

            if (addedAmount >= item.countInStock) {
              addedAmount = item.countInStock;
            }
            return {
              ...item,
              amount: addedAmount,
            };
          } else {
            return item;
          }
        });
      } else {
        let cartProducts;
        cartProducts = {
          ...product,
          amount,
        };
        state.cart.push(cartProducts);
      }
      updatedTotals(state);
      saveCartToLocalStorage(state);
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item._id !== action.payload);
      updatedTotals(state);
      saveCartToLocalStorage(state);
    },
    clearCart: (state) => {
      state.cart = [];
      updatedTotals(state);
      saveCartToLocalStorage(state);
    },
    increaseAmount: (state, action) => {
      state.cart = state.cart.map((item) => {
        if (item._id === action.payload) {
          let addedAmount = item.amount + 1;

          if (addedAmount > item.countInStock) {
            addedAmount = item.amount;
          }
          return {
            ...item,
            amount: addedAmount,
          };
        } else {
          return item;
        }
      });
      updatedTotals(state);
      saveCartToLocalStorage(state);
    },
    decreaseAmount: (state, action) => {
      state.cart = state.cart.map((item) => {
        if (item._id === action.payload) {
          let newAmount = item.amount - 1;

          if (newAmount <= 1) {
            newAmount = 1;
          }
          return {
            ...item,
            amount: newAmount,
          };
        } else {
          return item;
        }
      });
      updatedTotals(state);
      saveCartToLocalStorage(state);
    },
    saveShippingAddress: (state, action) => {
      state.shipping_address = action.payload;
      updatedTotals(state);
      saveCartToLocalStorage(state);
    },
    savePaymentMethod: (state, action) => {
      state.payment_method = action.payload;
      updatedTotals(state);
      saveCartToLocalStorage(state);
    },
    applyCoupon: (state, action) => {
      state.coupon_discount = action.payload;
    },
    clearCoupon: (state) => {
      state.coupon_discount = 0;
      saveCartToLocalStorage(state);
    }
  },
});

export const {
  addToCart,
  clearCart,
  decreaseAmount,
  increaseAmount,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  applyCoupon,
  clearCoupon
} = cartSlice.actions;
export default cartSlice.reducer;

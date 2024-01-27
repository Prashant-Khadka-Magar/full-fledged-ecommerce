import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  total_items: 0,
  total_price: 0,
};

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
  initialState,
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
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item._id !== action.payload);
      updatedTotals(state);
    },
    clearCart: (state) => {
      state.cart = [];
      updatedTotals(state);
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
    },
  },
});

export const {
  addToCart,
  clearCart,
  decreaseAmount,
  increaseAmount,
  removeFromCart,
} = cartSlice.actions;
export default cartSlice.reducer;

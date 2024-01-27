import { useSelector, useDispatch } from "react-redux";
import { FaTrash } from "react-icons/fa";
import {
  removeFromCart,
  clearCart,
  increaseAmount,
  decreaseAmount,
} from "../slices/cartSlice";
function Cart() {
  const { cart, total_price, shipping_fee } = useSelector(
    (state) => state.cart
  );

  const dispatch = useDispatch();

  if (cart.length <= 0) {
    return <h1>Continue Shopping</h1>;
  }

  return (
    <div>
      <div className="max-md:hidden bg-white flex pb-2">
        <table className="w-full">
          <thead>
            <tr>
              <th>Items</th>
              <th>Price</th>
              <th>Amount</th>
              <th>Subtotal</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {cart.map(({ _id, name, image, price, amount }) => (
              <tr className="mt-2" key={_id}>
                <td className="flex justify-center">
                  <div className="flex items-center">
                    <img
                      loading="lazy"
                      src={image}
                      alt="cart_img"
                      className="h-16"
                    />
                    <span>{name}</span>
                  </div>
                </td>
                <td>{price}</td>
                <td>
                  <div className="flex justify-center gap-x-1">
                    <button
                      onClick={() => dispatch(decreaseAmount(_id))}
                      className="bg-gray-500 px-2 text-white"
                    >
                      -
                    </button>
                    <p>{amount}</p>
                    <button
                      onClick={() => dispatch(increaseAmount(_id))}
                      className="bg-gray-500 px-2 text-white"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>{price * amount}</td>
                <td>
                  <FaTrash
                    onClick={() => dispatch(removeFromCart(_id))}
                    className=" text-red-500 cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden mt-2 bg-white">
        {cart.map(({ _id, name, image, price, amount }) => (
          <div
            key={_id}
            className="flex items-center justify-between   py-2 px-1 mt-2"
          >
            <img loading="lazy" src={image} alt="cart_img" className="h-16" />
            <div className="flex flex-col">
              <span>{name}</span>
              <span>{price}</span>
            </div>
            <div className="flex flex-col items-center gap-x-1">
              <button
                onClick={() => dispatch(decreaseAmount(_id))}
                className="bg-gray-500 px-2 text-white"
              >
                -
              </button>
              <p>{amount}</p>
              <button
                onClick={() => dispatch(increaseAmount(_id))}
                className="bg-gray-500 px-2 text-white"
              >
                +
              </button>
            </div>
            <FaTrash
              onClick={() => dispatch(removeFromCart(_id))}
              className=" text-red-500 cursor-pointer"
            />
          </div>
        ))}
      </div>
      <button onClick={() => dispatch(clearCart())}>Clear Cart</button>
      <div className=" flex justify-end">
        <div className="bg-white mr-2 p-2 px-4">
          <div className="flex gap-x-2">
            <p className="text-gray-500">SubTotal:</p>
            <p className="font-semibold">{total_price.toFixed(2)}</p>
          </div>
          <div className="flex gap-x-2">
            <p className="text-gray-500">Shipping Fee:</p>
            <p className="font-semibold">{shipping_fee}</p>
          </div>
          <div className="flex gap-x-2 border-t pt-4">
            <p className="text-gray-500">Grand Total:</p>
            <p className="font-semibold">{(shipping_fee + total_price).toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "../../slices/usersApiSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

function UserEdit() {
  const { id: userId } = useParams();
  const { data: user, isLoading } = useGetUserDetailsQuery(userId);
  const [updateUser, { isLoading: loadingUpdate }] =
    useUpdateUserMutation(userId);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.user.name);
      setEmail(user.user.email);
      setIsAdmin(user.user.isAdmin);
    }
  }, [user]);

  console.log(user);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const updatedUser = {
        userId,
        name,
        email,
        isAdmin,
      };

      const result = await updateUser(updatedUser);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("User Updated");
        navigate("/admin/userlist");
      }
    } catch (error) {
      // Handle any unexpected errors
      console.error("An error occurred during user update:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div>
      <h1>Edit User Details</h1>

      <form
        onSubmit={submitHandler}
        className="flex flex-col gap-y-2 items-center"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div>
          <input
            type="checkbox"
            id="isAdmin"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
          <label htmlFor="isAdmin">Is Admin</label>
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default UserEdit;

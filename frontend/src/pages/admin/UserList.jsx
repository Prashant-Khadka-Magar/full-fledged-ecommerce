import React from "react";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../../slices/usersApiSlice";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function UserList() {
  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUsersQuery();

  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const deleteUserHandler = async (userId) => {
    if (window.confirm("Are you sure you want to delete")) {
      try {
        await deleteUser(userId);
        toast.success("User deleted successfully")
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    }
  };

  //----------DOM----------
  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <div>Error fetching users</div>;
  }
  return (
    <div>
      {loadingDelete && <Loader />}
      <h1 className="text-center">All the Users</h1>
      <table className="table-auto border border-collapse w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">isAdmin</th>
            <th className="border p-2"></th>
          </tr>
        </thead>
        <tbody>
          {users.users.map((user) => (
            <tr key={user._id} className="border-b">
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">
                <a href={`mailto:${user.email}`}>{user.email}</a>
              </td>
              <td className="border p-2">
                {user.isAdmin ? <p>✔</p> : <p>❌</p>}
              </td>
              <td className="border p-2 flex gap-x-2">
                <span className="cursor-pointer hover:text-blue-500">
                    <Link to={`/admin/user/${user._id}/edit`}>🖋</Link>
                </span>
                <span className="cursor-pointer hover:text-red-500 ">
                  {user.isAdmin ? (
                    <p>❌</p>
                  ) : (
                    <p onClick={() => deleteUserHandler(user._id)}>🗑</p>
                  )}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;

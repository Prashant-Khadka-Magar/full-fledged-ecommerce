import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [avatar, setAvatar] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (
      email.trim() === "" ||
      password.trim() === "" ||
      name.trim() === "" ||
      !avatar
    ) {
      toast.error("Please Enter all the fields");
      return;
    }

    if (password !== password2) {
      toast.error("The passwords din't match");
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password2", password2);
    formData.append("avatar", avatar);

    try {
      const res = await register(formData).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success('User created Successfully')
      navigate(redirect);
    } catch (err) {
      toast.error(err.data.message || err.error);
    }
  };
  return (
    <div>
      <h1>Sign Up USER</h1>
      <form onSubmit={submitHandler} className="flex flex-col  items-center">
        <input
          type="text"
          placeholder="enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files[0])}
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />
        {!isLoading && <button type="submit">Sign Up</button>}
        {isLoading && <Loader />}
      </form>
      <div>
        Already have a account
        <Link to="/login" className="text-blue-500">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Register;

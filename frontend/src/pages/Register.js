import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ fullName: "", email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(form)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        navigate("/map"); // redirect after register
      }
    });
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" type="text" name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} />
        <input className="form-control mb-2" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input className="form-control mb-2" type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      {error && <p className="text-danger mt-2">{error}</p>}
    </div>
  );
}

export default Register;

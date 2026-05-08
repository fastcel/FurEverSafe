import { useState } from "react";
import bg from "../assets/bgsignup.png";
import logo from "../assets/logo.png";
import axios from "axios";

export default function LoginPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.username) newErrors.username = "Username is required";
    if (!form.password) {
    newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async () => {
  if (!validate()) return;

  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      username: form.username,
      password: form.password,
    });

    // ✅ store token (basic auth)
    localStorage.setItem("token", res.data.token);

    window.location.href = "/citizen-dashboard";

  } catch (err) {
    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      "Login failed";

    setErrors({ general: message });
  }
};

  return (
  <div className="flex h-screen w-screen overflow-hidden">
    {/* Left Image */}
    <div className="w-1/2 h-full overflow-hidden">
      <img src={bg} alt="bg" className="w-full h-full object-cover" />
    </div>

    {/* Right Form */}
    <div className="w-1/2 h-full bg-[#eef5e0] flex flex-col items-center justify-start pt-5 px-10 overflow-y-auto">

      {/* Logo */}
      <div className="flex flex-col items-center mt-8 mb-4">
        <img src={logo} alt="logo" className="w-[130px] h-[130px]" />
        <h1 className="text-[#e12e92] text-3xl font-bold">Login</h1>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm px-7 m-9 py-6 w-full max-w-md">

        {errors.general && (
          <p className="text-red-500 text-sm mb-3">{errors.general}</p>
        )}

        {/* Username */}
        <div className="mb-6">
          <label className="block text-xl font-semibold text-gray-700 mb-1">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter your Username..."
            className="w-full bg-gray-100 text-black rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#e87aab]"
          />
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">{errors.username}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-xl font-semibold text-gray-700 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your Password..."
            className="w-full bg-gray-100 text-black rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#e87aab]"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Login Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-[#d94f8a] hover:bg-[#c43f7a] text-white font-bold py-2.5 rounded-xl text-sm"
        >
          Login
        </button>

        {/* Anonymous Report */}
        <div className="mt-3">
          <button
            onClick={() => window.location.href = "/report"}
            className="w-full bg-[#5ba0c8] hover:bg-[#4a8fb3] text-white font-bold py-2.5 rounded-xl text-sm transition"
          >
            Report Anonymously
          </button>
        </div>

        {/* Signup Link */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-[#c06080] font-bold hover:underline">
            Signup
          </a>
        </p>

      </div>
    </div>
  </div>
);
}
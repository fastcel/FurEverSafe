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
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username: form.username,
        password: form.password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      console.log("LOGIN RESPONSE:", res.data);

      window.location.href = res.data.redirectTo;
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Login failed";

      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="w-1/2 h-full overflow-hidden">
        <img src={bg} alt="bg" className="w-full h-full object-cover" />
      </div>

      <div className="w-1/2 h-full bg-[#eef5e0] flex flex-col items-center justify-start pt-5 px-10 overflow-y-auto">
        <div className="flex flex-col items-center mt-8 mb-4">
          <img src={logo} alt="logo" className="w-[130px] h-[130px]" />
          <h1 className="text-[#e12e92] text-3xl font-bold">Login</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm px-7 m-9 py-6 w-full max-w-md">
          {errors.general && (
            <p className="text-red-500 text-sm mb-3">{errors.general}</p>
          )}

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

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full font-bold py-2.5 rounded-xl text-sm text-white transition
          ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#d94f8a] hover:bg-[#c43f7a]"}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-[#c06080] font-bold hover:underline"
            >
              Signup
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

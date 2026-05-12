import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/bgsignup.png";
import logo from "../assets/logo.png";
import axios from "axios";
import isEmail from 'validator/lib/isEmail';

export default function SignupPage() {
  const [role, setRole] = useState("citizen");

  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContactChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.slice(0, 11);
    if (val.length > 4) val = val.slice(0, 4) + '-' + val.slice(4, 11);
    setForm({ ...form, contact: val });
  };

  const handleSubmit = async () => {
    setErrors({});
    setLoading(true);

    const newErrors = {};

    if (!isEmail(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const digits = form.contact.replace(/\D/g, '');
    if (digits.length !== 11) {
      newErrors.contact = "Please enter a valid 11-digit contact number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name: form.name,
        email: form.email,
        contact: form.contact,
        password: form.password,
        role,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (role === "citizen") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/ngo-dashboard";
      }

    } catch (err) {
      const message = err.response?.data?.error;

      if (message === "Email already exists") {
        setErrors({ email: message });
      } else if (message === "Username already exists") {
        setErrors({ name: message });
      } else {
        setErrors({ general: message || "Server error" });
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* LEFT IMAGE */}
      <div className="w-1/2 h-full overflow-hidden">
        <img
          src={bg}
          alt="Park illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="w-1/2 h-full bg-[#eef5e0] flex flex-col items-center justify-start pt-5 px-10 py-8 overflow-y-auto">
        {/* LOGO */}
        <div className="flex flex-col items-center mb-4">
          <img
            src={logo}
            alt="FurEver Safe Logo"
            className="w-[125px] h-[125px]"
          />
          <h1 className="text-[#e12e92] text-2xl font-bold tracking-wide mt-0.5">
            Signup
          </h1>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-sm px-7 py-6 w-full max-w-md">
          {/* GENERAL ERROR */}
          {errors.general && (
            <p className="text-red-500 text-sm mb-3">{errors.general}</p>
          )}

          {/* Username */}
          <div className="mb-3">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your Username..."
              className="w-full bg-gray-100 text-black rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#e87aab]"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your Email..."
              className="w-full bg-gray-100 text-black rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#e87aab]"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Contact */}
          <div className="mb-3">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Contact No. <span className="text-red-500">*</span>
            </label>
            <input
              name="contact"
              value={form.contact}
              onChange={handleContactChange}
              placeholder="Enter your Contact Number..."
              maxLength={12}
              className="w-full bg-gray-100 text-black rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#e87aab]"
            />
            {errors.contact && (
              <p className="text-red-500 text-xs mt-1">{errors.contact}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
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
          </div>

          {/* ROLE */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              I am a <span className="text-red-500">*</span>
            </label>

            <div className="flex gap-3">
              <button
                onClick={() => setRole("citizen")}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition ${
                  role === "citizen"
                    ? "bg-[#e87aab] text-white"
                    : "bg-white text-gray-600 border-gray-300"
                }`}
              >
                Citizen
              </button>

              <button
                onClick={() => setRole("ngo")}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition ${
                  role === "ngo"
                    ? "bg-[#e87aab] text-white"
                    : "bg-white text-gray-600 border-gray-300"
                }`}
              >
                NGO Rep
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full font-bold py-2.5 rounded-xl text-white transition
              ${loading ? "bg-gray-400" : "bg-[#d94f8a] hover:bg-[#c43f7a]"}`}
          >
            {loading ? "Signing Up..." : "Create Account"}
          </button>

          {/* LOGIN */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <a href="/" className="text-[#c06080] font-bold">
              Login!
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
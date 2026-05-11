import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/bgsignup.png";
import logo from "../assets/logo.png";
import axios from "axios";

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

  
  const handleSubmit = async () => {
  setErrors({});
  setLoading(true);

  try {
    const res = await axios.post("http://localhost:5000/api/auth/signup", {
      name: form.name,
      email: form.email,
      contact: form.contact,
      password: form.password,
      role,
    });

    // optional: store token if backend returns it
    // localStorage.setItem("token", res.data.token);

    // redirect based on role
    if (role === "citizen") {
      navigate("/dashboard");
    } else {
      navigate("/ngo-dashboard");
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
              onChange={handleChange}
              placeholder="Enter your Contact Number..."
              className="w-full bg-gray-100 text-black rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#e87aab]"
            />
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
            <a href="/login" className="text-[#c06080] font-bold">
              Login!
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

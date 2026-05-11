import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";

export default function UserProfile() {
  const navigate = useNavigate();

  const [showSuccess, setShowSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [passwords, setPasswords] = useState({
    old: "",
    new: "",
    confirm: "",
  });

  const toggle = (field) =>
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));

  return (
    <Layout>
      <div className="w-full min-h-screen bg-[#f0ebe0] flex flex-col px-12 py-10">

        {/* Heading */}
        <h1 className="text-4xl font-bold text-[#3a3028] mb-8">
          User Profile
        </h1>

        {/* Profile Info Card */}
        <div className="w-full bg-[#e0d9cc] rounded-2xl p-8 mb-8 flex items-center gap-10 shadow-sm">

          {/* Avatar */}
          <div className="w-32 h-32 rounded-full bg-[#b8ae9e] flex items-center justify-center text-6xl shrink-0">
            👤
          </div>

          {/* User Info */}
          <div className="flex-1 grid grid-cols-[180px_1fr] gap-x-8 gap-y-5 text-base text-[#3a3028]">

            <span className="font-bold self-center">
              Name:
            </span>

            <span className="w-full bg-white rounded-lg px-4 py-3 border border-[#c8b89a]">
              testUser23
            </span>

            <span className="font-bold self-center">
              Email:
            </span>

            <span className="w-full bg-white rounded-lg px-4 py-3 border border-[#c8b89a]">
              thatuser@gmail.com
            </span>

            <span className="font-bold self-center">
              Phone number:
            </span>

            <span className="w-full bg-white rounded-lg px-4 py-3 border border-[#c8b89a]">
              +923326894921
            </span>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => navigate("/edit-profile")}
            className="self-start bg-[#d63384] hover:bg-[#b02770] text-white text-base font-bold px-8 py-3 rounded-lg shrink-0 transition"
          >
            Edit Profile
          </button>
        </div>

        {/* Change Password Card */}
        <div className="w-full bg-[#e0d9cc] rounded-2xl p-8 mb-8 shadow-sm">

          <h2 className="text-center text-3xl font-bold text-[#3a3028] mb-8">
            Change Password
          </h2>

          <div className="space-y-5">

            {[
              { label: "Old Password", key: "old" },
              { label: "New Password", key: "new" },
              { label: "Re-type New Password", key: "confirm" },
            ].map(({ label, key }) => (
              <div key={key} className="flex items-center gap-6">

                <label className="text-lg font-semibold text-[#3a3028] w-64 text-right shrink-0">
                  {label}
                </label>

                <div className="flex-1 flex items-center bg-white border border-[#c8b89a] rounded-lg overflow-hidden">

                  <input
                    type={showPassword[key] ? "text" : "password"}
                    value={passwords[key]}
                    onChange={(e) =>
                      setPasswords((p) => ({
                        ...p,
                        [key]: e.target.value,
                      }))
                    }
                    className="flex-1 px-5 py-4 text-base bg-transparent outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => toggle(key)}
                    className="px-5 text-[#7a6a5a] hover:text-[#3a3028] text-xl"
                  >
                    {showPassword[key] ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
            ))}

            {/* Forgot Password */}
            <div className="flex justify-end">
              <span
                className="text-sm text-[#d63384] cursor-pointer underline"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </span>
            </div>

            {/* Submit */}
            <button
              onClick={() => setShowSuccess(true)}
              className="w-full bg-[#d63384] hover:bg-[#b02770] text-white font-bold py-4 rounded-lg text-xl transition"
            >
              Submit
            </button>
          </div>
        </div>

        {/* Help Button */}
            <button
              onClick={() => navigate("/help-and-support")}
              className="w-full bg-[#d63384] hover:bg-[#b02770] text-white font-bold py-4 rounded-lg mb-4 text-xl transition">
               Help and Support
            </button>

        {/* Delete Account */}
        <button
          onClick={() => navigate("/delete-account")}
          className="w-full bg-[#8b1a2e] hover:bg-[#6e1424] text-white font-bold py-4 rounded-lg text-xl transition"
        >
          Delete Account
        </button>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-5 w-80">

            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-5xl">
              ✅
            </div>

            <p className="text-[#3a3028] font-bold text-lg text-center">
              Changes saved successfully!
            </p>

            <button
              onClick={() => setShowSuccess(false)}
              className="bg-[#d63384] hover:bg-[#b02770] text-white font-bold px-12 py-3 rounded-lg transition"
            >
              Return
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
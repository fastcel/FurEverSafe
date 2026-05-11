import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";

export default function NGOEditProfile() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });
  const [form, setForm] = useState({
    name: "testNGO23",
    email: "thatngo@gmail.com",
    phone: "+923326894921",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const toggle = (field) => setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

  return (
    <Layout>
      <div className="w-full min-h-screen bg-[#f0ebe0] flex flex-col py-10 px-12">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-[#3a3028]">NGO Profile</h1>
          <button onClick={() => navigate("/ngo-delete-account")}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-lg">
            Delete Account
          </button>
        </div>

        {/* Editable Info Card */}
        <div className="w-full bg-[#e0d9cc] rounded-2xl p-8 mb-8 shadow-sm">
          <div className="grid grid-cols-[180px_1fr] gap-x-8 gap-y-5 text-base text-[#3a3028]">
            {[
              { label: "Name:", key: "name", type: "text" },
              { label: "Email:", key: "email", type: "email" },
              { label: "Phone number:", key: "phone", type: "tel" },
            ].map(({ label, key, type }) => (
              <>
                <span key={label} className="font-bold self-center">{label}</span>
                <input key={key} type={type} value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="border border-[#c8b89a] rounded-lg px-4 py-3 text-base bg-white outline-none focus:ring-2 focus:ring-[#d63384]"
                />
              </>
            ))}
          </div>
        </div>

        {/* Change Password Card */}
        <div className="w-full bg-[#e0d9cc] rounded-2xl p-8 mb-8 shadow-sm">
          <h2 className="text-center text-3xl font-bold text-[#3a3028] mb-8">Change Password</h2>
          <div className="space-y-5">
            {[
              { label: "Old Password", key: "old", formKey: "oldPassword" },
              { label: "New Password", key: "new", formKey: "newPassword" },
              { label: "Re-type New Password", key: "confirm", formKey: "confirmPassword" },
            ].map(({ label, key, formKey }) => (
              <div key={key} className="flex items-center gap-6">
                <label className="text-lg font-semibold text-[#3a3028] w-64 text-right shrink-0">{label}</label>
                <div className="flex-1 flex items-center bg-white border border-[#c8b89a] rounded-lg overflow-hidden">
                  <input
                    type={showPassword[key] ? "text" : "password"}
                    value={form[formKey]}
                    onChange={(e) => setForm((f) => ({ ...f, [formKey]: e.target.value }))}
                    className="flex-1 px-5 py-4 text-base bg-transparent outline-none"
                  />
                  <button type="button" onClick={() => toggle(key)}
                    className="px-5 text-[#7a6a5a] hover:text-[#3a3028] text-xl">
                    {showPassword[key] ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <span className="text-sm text-[#d63384] cursor-pointer underline"
                onClick={() => navigate("/forgot-password")}>
                Forgot password?
              </span>
            </div>
          </div>
        </div>

        <button onClick={() => setShowSuccess(true)}
          className="w-full bg-[#d63384] hover:bg-[#b02770] text-white font-bold py-4 rounded-lg text-xl transition">
          Save
        </button>

      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-5 w-80">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-5xl">✅</div>
            <p className="text-[#3a3028] font-bold text-lg text-center">Changes saved successfully!</p>
            <button onClick={() => { setShowSuccess(false); navigate("/ngo-profile"); }}
              className="bg-[#d63384] hover:bg-[#b02770] text-white font-bold px-12 py-3 rounded-lg transition">
              Return
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

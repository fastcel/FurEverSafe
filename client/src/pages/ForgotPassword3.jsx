import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function ForgotPassword3() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState({ new: false, confirm: false });
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  const toggle = (field) => setShowPassword((p) => ({ ...p, [field]: !p[field] }));

  const handleReset = () => {
    if (form.newPassword && form.newPassword === form.confirmPassword) {
      setShowSuccess(true);
    }
  };

  return (
    <Layout>
      <div className="w-full min-h-screen bg-[#f0ebe0] flex flex-col py-10 px-10">

        <h1 className="text-2xl font-bold text-[#3a3028] mb-8">Forgot Password</h1>

        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-[#d63384] text-white">
                {step < 3 ? "✓" : "3"}
              </div>
              {step < 3 && <div className="w-12 h-0.5 bg-[#d63384]" />}
            </div>
          ))}
        </div>

        <div className="w-full bg-[#e0d9cc] rounded-xl p-8 space-y-5">
          <button onClick={() => navigate("/forgot-password/email-sent")}
            className="text-sm text-[#7a6a5a] hover:underline">
            ← Back to Step 2
          </button>
          <div className="text-center">
            <h2 className="text-lg font-bold text-[#3a3028]">Reset Password</h2>
            <p className="text-sm text-[#7a6a5a] mt-1">Choose a new password for your account!</p>
          </div>
          {[
            { label: "New Password", key: "new", formKey: "newPassword" },
            { label: "Re-Enter your New Password", key: "confirm", formKey: "confirmPassword" },
          ].map(({ label, key, formKey }) => (
            <div key={key} className="flex items-center gap-4">
              <label className="text-sm font-semibold text-[#3a3028] w-52 text-right shrink-0">{label}</label>
              <div className="flex-1 flex items-center bg-white border border-[#c8b89a] rounded overflow-hidden">
                <input
                  type={showPassword[key] ? "text" : "password"}
                  placeholder={label}
                  value={form[formKey]}
                  onChange={(e) => setForm((f) => ({ ...f, [formKey]: e.target.value }))}
                  className="flex-1 px-3 py-2 text-sm bg-transparent outline-none"
                />
                <button type="button" onClick={() => toggle(key)}
                  className="px-3 text-[#7a6a5a] hover:text-[#3a3028] text-base">
                  {showPassword[key] ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          ))}
          <button onClick={handleReset}
            className="w-full bg-[#d63384] hover:bg-[#b02770] text-white font-bold py-2.5 rounded">
            Reset Password
          </button>
        </div>

      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-4 w-72">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-4xl">✅</div>
            <p className="text-[#3a3028] font-bold text-base text-center">Password successfully changed!</p>
            <button onClick={() => navigate("/login")}
              className="bg-[#d63384] hover:bg-[#b02770] text-white font-bold px-10 py-2 rounded">
              Return
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

// ─── role-specific field configs ───────────────────────────────────────────
const PROFILE_FIELDS = {
  user: [
    { label: "Name:", key: "name", type: "text" },
    { label: "Email:", key: "email", type: "email" },
    { label: "Phone number:", key: "phone", type: "tel" },
  ],
  ngo: [
    { label: "Organisation Name:", key: "name", type: "text" },
    { label: "Email:", key: "email", type: "email" },
    { label: "Phone number:", key: "phone", type: "tel" },
    { label: "Registration No.:", key: "registrationNo", type: "text" },
    { label: "Website:", key: "website", type: "url" },
  ],
};

export default function EditProfile({ role = "user", initialData }) {
  const navigate = useNavigate();

  const profileFields = PROFILE_FIELDS[role];

  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    registrationNo: "",
    website: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const toggle = (field) =>
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

  // ─────────────────────────────────────────────
  // FETCH PROFILE FROM BACKEND
  // ─────────────────────────────────────────────
 useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/edit-profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setForm((prev) => ({
        ...prev,
        name: data.name || "",
        email: data.email || "",
        phone: data.contact_number || "",
        registrationNo: data.registrationNo || "",
        website: data.website || "",
      }));
    } catch (err) {
      console.error("FETCH PROFILE ERROR:", err.message);
    }
  };

  fetchProfile();
}, []);

  // ─────────────────────────────────────────────
  // SAVE PROFILE (PUT API)
  // ─────────────────────────────────────────────
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        name: form.name,
        email: form.email,
        contact_number: form.phone,
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      };

      const res = await fetch("http://localhost:5000/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setShowSuccess(true);
    } catch (err) {
      console.error("UPDATE PROFILE ERROR:", err.message);
      alert(err.message);
    }
  };

  return (
    <Layout>
      <div className="w-full min-h-screen bg-[#f0ebe0] flex flex-col py-10 px-10">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#3a3028]">User Profile</h1>
          <button
            onClick={() => navigate("/delete-account")}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2 rounded"
          >
            Delete Account
          </button>
        </div>

        {/* Editable Info Card */}
        <div className="w-full bg-[#e0d9cc] rounded-xl p-6 mb-5">
          <div className="grid grid-cols-[150px_1fr] gap-x-4 gap-y-3 text-sm text-[#3a3028]">
            {profileFields.map(({ label, key, type }) => (
              <>
                <span key={`label-${key}`} className="font-bold self-center">
                  {label}
                </span>
                <input
                  key={`input-${key}`}
                  type={type}
                  value={form[key] ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  className="border border-[#c8b89a] rounded px-3 py-1.5 text-sm bg-white outline-none focus:ring-2 focus:ring-[#d63384]"
                />
              </>
            ))}
          </div>
        </div>

        {/* Change Password Card */}
        <div className="w-full bg-[#e0d9cc] rounded-xl p-6 mb-5">
          <h2 className="text-center font-bold text-[#3a3028] mb-4">
            Change Password
          </h2>

          <div className="space-y-3">
            {[
              { label: "Old Password", key: "old", formKey: "oldPassword" },
              { label: "New Password", key: "new", formKey: "newPassword" },
              {
                label: "Re-type New Password",
                key: "confirm",
                formKey: "confirmPassword",
              },
            ].map(({ label, key, formKey }) => (
              <div key={key} className="flex items-center gap-4">
                <label className="text-sm font-semibold text-[#3a3028] w-44 text-right shrink-0">
                  {label}
                </label>

                <div className="flex-1 flex items-center bg-white border border-[#c8b89a] rounded overflow-hidden">
                  <input
                    type={showPassword[key] ? "text" : "password"}
                    value={form[formKey]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [formKey]: e.target.value }))
                    }
                    className="flex-1 px-3 py-2 text-sm bg-transparent outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => toggle(key)}
                    className="px-3 text-[#7a6a5a] hover:text-[#3a3028] text-base"
                  >
                    {showPassword[key] ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <span
                className="text-xs text-[#d63384] cursor-pointer underline"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </span>
            </div>
          </div>
        </div>

        {/* SAVE BUTTON → NOW CONNECTED */}
        <button
          onClick={handleSave}
          className="w-full bg-[#d63384] hover:bg-[#b02770] text-white font-bold py-2.5 rounded"
        >
          Save
        </button>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-4 w-72">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-4xl">
              ✅
            </div>
            <p className="text-[#3a3028] font-bold text-base text-center">
              Changes saved successfully!
            </p>
            <button
              onClick={() => {
                setShowSuccess(false);
                navigate("/profile");
              }}
              className="bg-[#d63384] hover:bg-[#b02770] text-white font-bold px-10 py-2 rounded"
            >
              Return
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

// ─── role-specific field configs ───────────────────────────────────────────
const PROFILE_FIELDS = {
  user: [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone number", key: "phone" },
  ],
  ngo: [
    { label: "Organisation Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone number", key: "phone" },
    { label: "Registration No.", key: "registrationNo" },
    { label: "Website", key: "website" },
  ],
};

export default function UserProfile({ role = "user" }) {
  const navigate = useNavigate();

  const profileFields = PROFILE_FIELDS[role];
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ─── state for API data ────────────────────────────────────────────────
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    registrationNo: "",
    website: "",
  });

  const [loading, setLoading] = useState(true);

  // ─── fetch profile from backend ────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to load profile");

        // map backend → frontend format
        setProfileData({
          name: data.name,
          email: data.email,
          phone: data.contact_number,
          registrationNo: data.registrationNo,
          website: data.website,
        });

        setLoading(false);
      } catch (err) {
        console.error("PROFILE FETCH ERROR:", err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/profile", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      localStorage.clear();
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="w-full min-h-screen bg-[#f0ebe0] flex items-center justify-center">
          <p className="text-[#3a3028] font-bold">Loading profile...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full min-h-screen bg-[#f0ebe0] flex flex-col px-12 py-10">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-[#3a3028] mb-8">User Profile</h1>

        {/* Profile Info Card */}
        <div className="w-full bg-[#e0d9cc] rounded-2xl p-8 mb-8 flex items-center gap-10 shadow-sm">
          {/* Dynamic Fields */}
          <div className="flex-1 grid grid-cols-[180px_1fr] gap-x-8 gap-y-5 text-base text-[#3a3028]">
            {profileFields.map(({ label, key }) => (
              <>
                <span key={`label-${key}`} className="font-bold self-center">
                  {label}:
                </span>
                <span
                  key={`value-${key}`}
                  className="w-full bg-white rounded-lg px-4 py-3 border border-[#c8b89a]"
                >
                  {profileData[key] ?? "—"}
                </span>
              </>
            ))}

            {/* Password row — always shown as dots */}
            <span className="font-bold self-center">Password:</span>
            <span className="w-full bg-white rounded-lg px-4 py-3 border border-[#c8b89a] tracking-widest text-xl">
              ••••••••
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

        {/* Help Button */}
        <button
          onClick={() => navigate("/help-and-support")}
          className="w-full bg-[#d63384] hover:bg-[#b02770] text-white font-bold py-4 rounded-lg mb-4 text-xl transition"
        >
          Help and Support
        </button>

        {/* Delete Account */}
        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full bg-[#8b1a2e] hover:bg-[#6e1424] text-white font-bold py-4 rounded-lg text-xl transition"
        >
          Delete Account
        </button>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[350px] text-center">
            <h2 className="text-xl font-bold text-[#3a3028] mb-4">
              Delete Account?
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              This action is permanent. Your account and data will be removed.
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 rounded bg-gray-300 hover:bg-gray-400 font-bold"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  setShowDeleteModal(false);
                  await handleDeleteAccount();
                }}
                className="px-5 py-2 rounded bg-[#8b1a2e] hover:bg-[#6e1424] text-white font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

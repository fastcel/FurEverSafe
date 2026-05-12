import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../components/Layout";

export default function AdoptionsPage() {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [targetPet, setTargetPet] = useState("");
  const [targetApplicationId, setTargetApplicationId] = useState(null);

  useEffect(() => {
    const fetchAdoptions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/adoption/my-applications`,
          {
            params: { tab: activeTab },
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setAdoptions(response.data.applications || []);
      } catch (err) {
        console.error("Failed to load adoptions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdoptions();
  }, [activeTab]);

  const handleCancelClick = (name, applicationId) => {
    setTargetPet(name);
    setTargetApplicationId(applicationId);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/adoption/my-applications/${targetApplicationId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setShowCancelModal(false);
      setShowSuccessModal(true);
      setAdoptions((prev) =>
        prev.filter((a) => a.application_id !== targetApplicationId),
      );
    } catch (err) {
      alert(err.response?.data?.error || "Failed to cancel");
      setShowCancelModal(false);
    }
  };

  const getStatusColor = (status) => {
    const s = status.toLowerCase();
    if (s === "pending") return "bg-yellow-100 text-yellow-800";
    if (s === "approved") return "bg-green-100 text-green-800";
    if (s === "rejected" || s === "cancelled") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <Layout>
      <div className="w-full px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black text-primary">My Adoptions</h1>
        </div>

        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveTab("ongoing")}
            className={`px-8 py-2 rounded-sm font-bold border-2 border-black transition-all ${activeTab === "ongoing" ? "bg-[#C2185B] text-white" : "bg-white text-gray-400"}`}
          >
            Ongoing
          </button>
          <button
            onClick={() => setActiveTab("previous")}
            className={`px-8 py-2 rounded-sm font-bold border-2 border-black transition-all ${activeTab === "previous" ? "bg-[#C2185B] text-white" : "bg-white text-gray-400"}`}
          >
            Previous
          </button>
        </div>

        {loading ? (
          <p className="text-xl font-bold animate-pulse">Loading...</p>
        ) : (
          <div className="space-y-5">
            {adoptions.length > 0 ? (
              adoptions.map((app) => (
                <div
                  key={app.application_id}
                  className="bg-[#DED9C4] border-2 border-black p-6 flex items-center justify-between rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-8">
                    <img
                      src={app.image_url || "https://placecats.com/150/150"}
                      className="w-28 h-28 border-2 border-black object-cover rounded-md flex-shrink-0"
                      alt={app.pet_name}
                    />
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-[#6A1B9A]">
                        {app.pet_name}
                      </h3>
                      <p className="text-base font-medium text-[#6A1B9A]">
                        {app.breed} <span className="mx-2">•</span> {app.age}
                      </p>
                      <p className="text-base font-bold text-[#6A1B9A]">
                        {app.city}
                      </p>
                      <p className="text-sm text-gray-500 font-medium">
                        Applied {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <span
                      className={`px-4 py-1 rounded-full font-black text-sm border-2 border-black ${getStatusColor(app.status)}`}
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                    {app.status === "pending" && (
                      <button
                        onClick={() =>
                          handleCancelClick(app.pet_name, app.application_id)
                        }
                        className="bg-red-100 text-red-700 px-6 py-2 border-2 border-black font-bold text-sm rounded-sm hover:bg-red-200 transition-all"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg font-bold">
                No {activeTab} applications found.
              </div>
            )}
          </div>
        )}

        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-[#EDEFD7] p-8 border-2 border-black rounded-lg max-w-sm text-center shadow-xl">
              <div className="text-orange-500 text-6xl mb-4">⚠</div>
              <h3 className="text-xl font-black text-[#C2185B] mb-4">
                Are you sure you want to cancel?
              </h3>
              <p className="text-sm mb-8 text-gray-600">
                Are you sure you want to withdraw your application for{" "}
                <strong>{targetPet}</strong>? This will remove you from the
                waiting list and notify the NGO.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 bg-red-400 py-2 border-2 border-black rounded-sm font-bold hover:bg-red-500 transition-all"
                >
                  No, Go Back
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="flex-1 bg-green-200 py-2 border-2 border-black rounded-sm font-bold hover:bg-green-300 transition-all"
                >
                  Yes, I'm Sure
                </button>
              </div>
            </div>
          </div>
        )}

        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-[#EDEFD7] p-8 border-2 border-black rounded-lg text-center shadow-xl">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-3xl">✔</span>
              </div>
              <p className="text-[#C2185B] font-black text-xl mb-6">
                Adoption request successfully cancelled.
              </p>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setActiveTab("previous");
                }}
                className="bg-[#C2185B] text-white px-12 py-2 border-2 border-black rounded-sm font-bold hover:bg-[#a01548] transition-all"
              >
                Return
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

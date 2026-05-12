import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import ConfirmationModal from "../../components/ConfirmationModal";

export default function ApplicantListing({ pet, onBack }) {
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [details, setDetails] = useState(null);
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/adoption/ngo/pets/${pet.pet_id}/applications`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setApplicants(res.data.applications || res.data);
        if (res.data.applications?.length || res.data?.length) {
          const first = res.data.applications?.[0] || res.data[0];
          setSelectedApplicant(first);
          fetchDetails(first.application_id);
        }
      } catch (err) {
        console.error("Failed to fetch applicants:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [pet.pet_id]);

  const fetchDetails = async (applicationId) => {
    try {
      setDetailLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/adoption/ngo/applications/${applicationId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setDetails(res.data.application || res.data);
    } catch (err) {
      console.error("Failed to fetch details:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleApplicantClick = (applicant) => {
    setSelectedApplicant(applicant);
    fetchDetails(applicant.application_id);
  };

  const handleConfirm = async () => {
    try {
      const endpoint =
        action === "accept"
          ? `http://localhost:5000/api/adoption/ngo/applications/${selectedApplicant.application_id}/approve`
          : `http://localhost:5000/api/adoption/ngo/applications/${selectedApplicant.application_id}/reject`;

      await axios.patch(
        endpoint,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const res = await axios.get(
        `http://localhost:5000/api/adoption/ngo/pets/${pet.pet_id}/applications`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const updated = res.data.applications || res.data;
      setApplicants(updated);

      if (action === "accept") {
        onBack();
      }

      setAction(null);
    } catch (err) {
      alert(err.response?.data?.error || "Action failed");
      setAction(null);
    }
  };

  return (
    <Layout>
      <div className="w-full px-8 py-8">
        <button
          onClick={onBack}
          className="mb-6 text-[#C2185B] font-bold flex items-center gap-2 hover:underline text-lg"
        >
          ← Back to Adoption Requests
        </button>

        <h1 className="text-3xl font-black text-[#6A1B9A] mb-6">
          Applicants for {pet.name}
        </h1>

        {loading ? (
          <p className="font-bold animate-pulse">Loading applicants...</p>
        ) : (
          <div className="flex border-2 border-black min-h-[500px] rounded-lg overflow-hidden shadow-md">
            <div className="w-64 bg-[#C2185B] border-r-2 border-black overflow-y-auto flex-shrink-0">
              {applicants.map((applicant) => (
                <button
                  key={applicant.application_id}
                  onClick={() => handleApplicantClick(applicant)}
                  className={`w-full text-left p-4 font-bold border-b border-black/20 transition-colors ${
                    selectedApplicant?.application_id ===
                    applicant.application_id
                      ? "bg-[#8E1042] text-white"
                      : "text-white/80 hover:bg-[#A3154D]"
                  }`}
                >
                  <span>{applicant.applicant_name}</span>
                  {applicant.status !== "pending" && (
                    <span
                      className={`block text-xs mt-1 ${
                        applicant.status === "approved"
                          ? "text-green-300"
                          : "text-red-300"
                      }`}
                    >
                      {applicant.status.toUpperCase()}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex-1 bg-[#EDEFD7] p-8 overflow-y-auto">
              {detailLoading ? (
                <p className="font-bold animate-pulse">Loading details...</p>
              ) : details ? (
                <>
                  {selectedApplicant?.status === "pending" && (
                    <div className="flex justify-center gap-4 mb-8">
                      <button
                        onClick={() => setAction("accept")}
                        className="bg-[#A8E6A1] px-8 py-2 border-2 border-black font-bold hover:bg-green-300 transition-all"
                      >
                        Accept Applicant
                      </button>
                      <button
                        onClick={() => setAction("reject")}
                        className="bg-[#D98282] px-8 py-2 border-2 border-black font-bold hover:bg-red-400 transition-all"
                      >
                        Reject Applicant
                      </button>
                    </div>
                  )}

                  {selectedApplicant?.status !== "pending" && (
                    <div
                      className={`text-center font-black text-xl mb-8 py-3 rounded-lg border-2 border-black ${
                        selectedApplicant?.status === "approved"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      Application {selectedApplicant?.status?.toUpperCase()}
                    </div>
                  )}

                  <h2 className="text-2xl font-black text-[#C2185B] mb-6">
                    Application Details — {details.applicant_name}
                  </h2>

                  <div className="grid grid-cols-2 gap-6 text-base">
                    {[
                      { label: "Full Name", value: details.full_name },
                      { label: "Email", value: details.email },
                      { label: "Contact", value: details.contact_number },
                      {
                        label: "Preferred Contact",
                        value: details.preferred_contact_method,
                      },
                      {
                        label: "House Type",
                        value: details.house_type?.replace(/_/g, " "),
                      },
                      {
                        label: "Monthly Income",
                        value: details.monthly_income_range
                          ? details.monthly_income_range
                              .replace(/_/g, " ")
                              .replace(/\s+/g, " - ")
                          : "—",
                      },
                      {
                        label: "Monthly Budget",
                        value: details.monthly_budget_range
                          ? details.monthly_budget_range
                              .replace(/_/g, " ")
                              .replace(/\s+/g, " - ")
                          : "—",
                      },
                      {
                        label: "Pet Alone Hours",
                        value: details.pet_alone_hours?.replace(/_/g, " "),
                      },
                      {
                        label: "Has Children",
                        value: details.has_children ? "Yes" : "No",
                      },
                      {
                        label: "Other Pets",
                        value: details.other_pets?.join(", ") || "None",
                      },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="bg-white border-2 border-black rounded-lg p-4"
                      >
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                          {label}
                        </p>
                        <p className="font-bold text-[#6A1B9A]">
                          {value || "—"}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 bg-white border-2 border-black rounded-lg p-4">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                      Motivation
                    </p>
                    <p className="font-bold text-[#6A1B9A] leading-relaxed">
                      {details.motivation || "—"}
                    </p>
                  </div>
                </>
              ) : (
                <p className="font-bold text-gray-500">
                  Select an applicant to view details.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {action && (
        <ConfirmationModal
          type={action}
          onClose={() => setAction(null)}
          onConfirm={handleConfirm}
        />
      )}
    </Layout>
  );
}

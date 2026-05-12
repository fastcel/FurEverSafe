import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import NGOAdoptionItem from "../../components/NGOAdoptionItem";
import ApplicantListing from "./ApplicantListing";
import AdopterDetailsModal from "../../components/AdopterDetailsModal";

export default function NGOAdoptions() {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [selectedAdopter, setSelectedAdopter] = useState(null);
  const [viewingApplicantsFor, setViewingApplicantsFor] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplicationDetails = async (petId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/adoption/ngo/pets/${petId}/approved`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSelectedAdopter(res.data);
    } catch (err) {
      console.error("Failed to fetch application details:", err);
    }
  };

  const fetchPets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/adoption/ngo/pets",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setPets(res.data.pets || res.data);
    } catch (err) {
      console.error("Failed to fetch pets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);
  const ongoingPets = pets.filter((p) => p.status !== "adopted");
  const acceptedPets = pets.filter((p) => p.status === "adopted");

  if (viewingApplicantsFor) {
    return (
      <ApplicantListing
        pet={viewingApplicantsFor}
        onBack={() => {
          setViewingApplicantsFor(null);
          fetchPets();
        }}
      />
    );
  }

  return (
    <Layout>
      <div className="w-full px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black text-primary">Adoptions</h1>
        </div>

        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveTab("ongoing")}
            className={`px-8 py-2 rounded-sm font-bold border-2 border-black transition-all ${activeTab === "ongoing" ? "bg-[#C2185B] text-white" : "bg-white text-gray-400"}`}
          >
            Ongoing
          </button>
          <button
            onClick={() => setActiveTab("accepted")}
            className={`px-8 py-2 rounded-sm font-bold border-2 border-black transition-all ${activeTab === "accepted" ? "bg-[#C2185B] text-white" : "bg-white text-gray-400"}`}
          >
            Accepted
          </button>
        </div>

        {loading ? (
          <p className="text-xl font-bold animate-pulse">Loading...</p>
        ) : (
          <div className="space-y-5">
            {activeTab === "ongoing" ? (
              ongoingPets.length > 0 ? (
                ongoingPets.map((pet) => (
                  <NGOAdoptionItem
                    key={pet.pet_id}
                    data={{
                      id: pet.pet_id,
                      petName: pet.name,
                      breed: pet.breed,
                      age: pet.age,
                      location: pet.city,
                      totalApplications: pet.total_applications,
                      newCount: 0,
                      image: pet.image_url || "https://placecats.com/300/200",
                    }}
                    onViewApplications={() => setViewingApplicantsFor(pet)}
                  />
                ))
              ) : (
                <p className="font-bold text-gray-500">
                  No ongoing applications.
                </p>
              )
            ) : acceptedPets.length > 0 ? (
              acceptedPets.map((pet) => (
                <div
                  key={pet.pet_id}
                  className="bg-[#DED9C4] border-2 border-black p-6 flex items-center justify-between rounded-lg shadow-sm"
                >
                  <div className="flex items-center gap-8">
                    <img
                      src={pet.image_url || "https://placecats.com/300/200"}
                      className="w-28 h-28 border-2 border-black object-cover rounded-md"
                      alt=""
                    />
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-[#6A1B9A]">
                        {pet.name}
                      </h3>
                      <p className="text-base font-medium text-[#6A1B9A]">
                        {pet.breed} • {pet.age}
                      </p>
                      <p className="text-base font-bold text-[#6A1B9A]">
                        {pet.city}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => fetchApplicationDetails(pet.pet_id)}
                    className="bg-[#EDEFD7] text-black px-6 py-2 border-2 border-black font-bold text-sm rounded-sm hover:bg-white transition-all"
                  >
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <p className="font-bold text-gray-500">
                No accepted adoptions yet.
              </p>
            )}
          </div>
        )}

        {selectedAdopter && (
          <AdopterDetailsModal
            adopter={selectedAdopter}
            onClose={() => setSelectedAdopter(null)}
          />
        )}
      </div>
    </Layout>
  );
}

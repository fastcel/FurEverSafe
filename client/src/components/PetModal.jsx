import React from "react";
import { useNavigate } from "react-router-dom";

const PetModal = ({ pet, onClose }) => {
  const navigate = useNavigate();
  const vaccination = pet.vaccination_status;

  const vaccineData = {
    fully_vaccinated: {
      icon: "🛡️",
      text: "Fully Vaccinated",
      color: "text-green-700",
    },
    partially_vaccinated: {
      icon: "⚠️",
      text: "Partially Vaccinated",
      color: "text-yellow-700",
    },
    not_vaccinated: {
      icon: "❌",
      text: "Not Vaccinated",
      color: "text-red-700",
    },
  };

  const vaccine = vaccineData[vaccination] || vaccineData.not_vaccinated;

  if (!pet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto border-2 border-black bg-[#EDEFD7]">
        <div className="relative flex items-center justify-between border-b-2 border-black bg-[#DED9C4] px-6 py-3">
          <div className="w-1/3 flex justify-start">
            <button
              onClick={() => navigate(`/adopt/${pet.pet_id}`)}
              className="bg-[#C2185B] text-white px-5 py-2 font-bold border-2 border-black hover:bg-[#a3154d] transition"
            >
              Adopt
            </button>
          </div>

          <div className="w-1/3 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#6A1B9A]">
              {pet.name}
              <span className="ml-2 text-xl font-normal opacity-50">
                {pet.gender === "female" ? "♀" : "♂"}
              </span>
            </h2>
          </div>

          <div className="w-1/3 flex justify-end">
            <button
              onClick={onClose}
              className="text-3xl font-bold hover:text-red-600"
            >
              ×
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <div className="flex flex-col gap-4">
            <div className="border-2 border-black bg-[#F5F3E7] p-3">
              <img
                src={pet.images?.[0] || ""}
                alt={pet.name}
                className="w-full h-auto max-h-[400px] object-cover"
              />
            </div>

            <div className="bg-[#F5F3E7] border-2 border-black py-4 px-6 text-center">
              <span className="text-3xl block mb-2">{vaccine.icon}</span>

              <p className={`font-bold text-2xl ${vaccine.color}`}>
                {vaccine.text}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6 pr-2 md:pr-4">
            <div className="bg-[#F5F3E7] border-2 border-black p-6 h-full">
              <p className="font-bold text-sm uppercase tracking-widest text-[#C2185B] mb-4">
                Description
              </p>

              <p className="text-gray-700 text-lg leading-relaxed">
                {pet.description ||
                  `${pet.name} is a loving and friendly pet looking for a forever home.`}
              </p>
            </div>

            <div className="bg-[#F5F3E7] border-2 border-black p-6">
              <div className="grid grid-cols-2 gap-8 text-base">
                <div className="space-y-8">
                  <div className="border-b-2 border-black pb-3">
                    <p className="font-bold opacity-60 mb-2">Age</p>
                    <p className="font-bold text-3xl text-gray-800">
                      {pet.age}
                    </p>
                  </div>

                  <div className="border-b-2 border-black pb-3">
                    <p className="font-bold opacity-60 mb-2">Breed</p>
                    <p className="font-bold text-2xl text-gray-800">
                      {pet.breed}
                    </p>
                  </div>
                </div>

                <div className="space-y-8 border-l-2 border-black pl-8">
                  <div className="border-b-2 border-black pb-3">
                    <p className="font-bold opacity-60 mb-2">NGO</p>
                    <p className="font-bold text-2xl text-gray-800">PetCare</p>
                  </div>

                  <div className="border-b-2 border-black pb-3">
                    <p className="font-bold opacity-60 mb-2">Location</p>
                    <p className="font-bold text-2xl text-gray-800">
                      {pet.city}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetModal;

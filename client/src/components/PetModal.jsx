import React from "react";
import { useNavigate } from "react-router-dom";

const PetModal = ({ pet, onClose }) => {
  const navigate = useNavigate();

  if (!pet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl border-2 border-black bg-[#EDEFD7]">

        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black bg-[#DED9C4] px-8 py-5">
          
          <h2 className="flex-1 text-center text-4xl font-bold tracking-tight text-[#6A1B9A]">
            {pet.name}
            <span className="ml-1 text-2xl font-normal opacity-50">
              {pet.gender === "female" ? "♀" : "♂"}
            </span>
          </h2>

          <button
            onClick={() => navigate(`/adopt/${pet.name}`)}
            className="bg-[#C2185B] text-white px-6 py-2.5 font-bold border-2 border-black hover:bg-[#a3154d] transition"
          >
            Start Adoption
          </button>

          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-3xl font-bold hover:text-red-600"
          >
            ×
          </button>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 p-8">

          {/* LEFT SIDE - Single Image */}
          <div className="border-2 border-black bg-[#F5F3E7] p-3">
            <img
              src={pet.image}
              alt={pet.name}
              className="w-full h-[650px] object-cover"
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col gap-6">

            {/* History */}
            <div className="bg-[#F5F3E7] border-2 border-black p-6">
              <p className="font-bold text-sm uppercase tracking-widest text-[#C2185B] mb-4">
                History
              </p>

              <p className="text-gray-700 text-lg leading-relaxed">
                {pet.description ||
                  `${pet.name} is a loving and friendly pet looking for a forever home.`}
              </p>
            </div>

            {/* Pet Details */}
            <div className="bg-[#F5F3E7] border-2 border-black p-6">
              <div className="grid grid-cols-2 gap-8 text-base">

                {/* Left Column */}
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

                {/* Right Column */}
                <div className="space-y-8 border-l-2 border-black pl-8">

                  <div className="border-b-2 border-black pb-3">
                    <p className="font-bold opacity-60 mb-2">NGO</p>
                    <p className="font-bold text-2xl text-gray-800">
                      PetCare
                    </p>
                  </div>

                  <div className="border-b-2 border-black pb-3">
                    <p className="font-bold opacity-60 mb-2">Location</p>
                    <p className="font-bold text-2xl text-gray-800">
                      {pet.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vaccinated Box */}
            <div className="bg-[#F5F3E7] border-2 border-black p-8 text-center">
              <span className="text-5xl block mb-3">🛡️</span>

              <p className="font-bold text-3xl text-[#6A1B9A]">
                Fully Vaccinated
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetModal;
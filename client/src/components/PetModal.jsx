import React from 'react';
import { useNavigate } from 'react-router-dom';

const PetModal = ({ pet, onClose }) => {
  const navigate = useNavigate();
  if (!pet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[#EDEFD7] w-full max-w-4xl rounded-sm border-2 border-black overflow-hidden relative">

        {/* Header */}
        <div className="bg-[#DED9C4] p-6 flex justify-between items-center border-b-2 border-black">
          <h2 className="text-4xl font-bold text-[#6A1B9A] ml-auto mr-auto tracking-tight">
            {pet.name} <span className="text-2xl font-normal opacity-50">{pet.gender === 'female' ? '♀' : '♂'}</span>
          </h2>
          <button
            onClick={() => navigate(`/adopt/${pet.name}`)}
            className="bg-[#C2185B] text-white px-8 py-2.5 rounded-sm font-bold border-2 border-black hover:bg-[#a3154d] transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-black">
            Start Adoption
          </button>
          <button onClick={onClose} className="absolute top-4 right-6 text-3xl font-bold hover:text-red-600 transition-colors">×</button>
        </div>

        {/* Carousel Area */}
        <div className="relative flex items-center justify-center py-12 bg-[#EDEFD7]">
          <button className="absolute left-8 bg-[#C2185B] p-4 rounded-full border-2 border-black z-10 hover:scale-110 active:scale-95 transition-transform text-white text-xl">
            ←
          </button>

          <div className="flex gap-6 items-center">
            <img src={pet.image} className="w-44 h-44 object-cover border-2 border-black opacity-40 grayscale" alt="prev" />
            <div className="relative group">
              <div className="absolute -inset-2 bg-black opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <img src={pet.image} className="w-80 h-80 object-cover border-4 border-black relative z-10 scale-105" alt="main" />
            </div>
            <img src={pet.image} className="w-44 h-44 object-cover border-2 border-black opacity-40 grayscale" alt="next" />
          </div>

          <button className="absolute right-8 bg-[#C2185B] p-4 rounded-full border-2 border-black z-10 hover:scale-110 active:scale-95 transition-transform text-white text-xl">
            →
          </button>
        </div>

        {/* Details Footer */}
        <div className="p-8 flex gap-10 items-start border-t-2 border-black bg-[#EDEFD7]">
          <div className="flex-1 bg-[#DED9C4] p-5 rounded-sm border-2 border-black text-[15px] leading-relaxed">
            <p className="font-bold text-xs uppercase tracking-widest text-[#C2185B] mb-2">History</p>
            <p className="text-gray-700">{pet.name}, rescued after nearly drowning in a river, is a small, soft-furred, blue-eyed stray with a gentle nature.</p>
          </div>

          <div className="flex-[1.5] grid grid-cols-2 gap-x-12 text-sm pt-2">
            <div className="space-y-4">
              <p className="flex justify-between border-b-2 border-black pb-1"><span className="font-bold opacity-60">Age</span> <span className="font-bold text-gray-800">{pet.age}</span></p>
              <p className="flex justify-between border-b-2 border-black pb-1"><span className="font-bold opacity-60">Breed</span> <span className="font-bold text-gray-800">{pet.breed}</span></p>
            </div>
            <div className="space-y-4 border-l-2 border-black pl-10">
              <p className="flex justify-between border-b-2 border-black pb-1"><span className="font-bold opacity-60">NGO</span> <span className="font-bold text-gray-800">PetCare</span></p>
              <p className="flex justify-between border-b-2 border-black pb-1"><span className="font-bold opacity-60">Location</span> <span className="font-bold text-gray-800">{pet.location}</span></p>
            </div>
          </div>

          <div className="flex-1 text-center font-bold text-[#6A1B9A] bg-[#DED9C4] p-4 border-2 border-black rounded-sm">
            <span className="text-2xl mb-1 block">🛡️</span>
            <p className="text-sm">Fully Vaccinated</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetModal;
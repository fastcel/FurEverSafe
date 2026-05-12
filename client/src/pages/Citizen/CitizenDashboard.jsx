import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import PetCard from '../../components/PetCard';
import PetModal from '../../components/PetModal';
import SortDropdown from '../../components/SortDropdown';
import FilterModal from '../../components/DashboardFilterModal';

export default function CitizenDashboard() {
  const [selectedPet, setSelectedPet] = useState(null);
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/pets');
        setPets(response.data); 
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load pets.");
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  const groupedPets = pets.reduce((groups, pet) => {
    const type = pet.pet_type || pet.animalType || "Other";
    if (!groups[type]) groups[type] = [];
    groups[type].push(pet);
    return groups;
  }, {});

  const animalTypes = Object.keys(groupedPets);

  return (
    <Layout>
      {/* Background color for the main content area to match Figma's soft cream/beige */}
      <div className="w-full min-h-screen p-8 bg-[#F5F1E3]">
        {selectedPet && <PetModal pet={selectedPet} onClose={() => setSelectedPet(null)} />}

        {/* --- HEADER SECTION --- */}
        {/* Added flex-nowrap and specific gap to match Figma's alignment */}
        <div className="flex items-center justify-between gap-6 mb-10 w-full">
          
          {/* Search Bar: Reduced height and rounded borders like Figma */}
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full py-2 pl-12 pr-4 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-sm text-lg" 
            />
          </div>

          {/* Buttons: Added shadow, rounded corners, and specific Figma Pink color */}
          <div className="flex gap-4">
            <div className="relative">
              <button
                onClick={() => { setShowSort(!showSort); setShowFilter(false); }}
                className="bg-[#C2185B] text-white px-6 py-2 rounded-md font-bold text-sm border-b-4 border-black hover:bg-[#A3144D] active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2"
              >
                ↕ Sort
              </button>
              {showSort && <div className="absolute right-0 mt-2 z-50"><SortDropdown onClose={() => setShowSort(false)} /></div>}
            </div>

            <div className="relative">
              <button
                onClick={() => { setShowFilter(!showFilter); setShowSort(false); }}
                className="bg-[#C2185B] text-white px-6 py-2 rounded-md font-bold text-sm border-b-4 border-black hover:bg-[#A3144D] active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2"
              >
                🔍 Filter
              </button>
              {showFilter && <div className="absolute right-0 mt-2 z-50"><FilterModal onClose={() => setShowFilter(false)} /></div>}
            </div>
          </div>
        </div>

        {/* --- PETS CONTENT --- */}
        <div className="w-full">
          {loading ? (
            <div className="text-center py-20 font-bold text-xl text-pink-700 animate-pulse">Fetching your new friends...</div>
          ) : error ? (
            <div className="text-center py-20 text-red-600 font-bold">{error}</div>
          ) : (
            <>
              {animalTypes.length > 0 ? (
                animalTypes.map((type) => (
                  <section key={type} className="mb-14">
                    {/* Header: Dark purple/black color and proper margin */}
                    <h2 className="text-3xl font-black mb-8 text-[#3A1D44] capitalize">
                      {type}s
                    </h2>

                    {/* Grid Layout: Using 4 columns for large screens to match Figma */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                      {groupedPets[type].map((pet) => (
                        <PetCard 
                          key={pet.pet_id || pet.id} 
                          {...pet} 
                          image={pet.image_url || pet.image}
                          onClick={() => setSelectedPet(pet)} 
                        />
                      ))}
                    </div>
                  </section>
                ))
              ) : (
                <div className="text-center py-20 text-gray-500 italic text-xl border-2 border-dashed border-gray-300 rounded-xl">
                  No furry friends currently available.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
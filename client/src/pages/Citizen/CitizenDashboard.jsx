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

  //API INTEGRATION STATES
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


  // --- FETCH DATA FROM REST API ---
  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/pets');
        
        setPets(response.data); 
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load pets. Is the server running?");
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  // Filter live data into categories
  const cats = pets.filter(p => p.animalType?.toLowerCase() === 'cat');
  const dogs = pets.filter(p => p.animalType?.toLowerCase() === 'dog');
  const rabbits = pets.filter(p => p.animalType?.toLowerCase() === 'rabbit');

  return (
    <Layout>
      <div className="w-full relative">
        {selectedPet && <PetModal pet={selectedPet} onClose={() => setSelectedPet(null)} />}

        {/* Header / Search Bar */}
        <div className="flex items-center gap-4 mb-8 w-full relative">
          <div className="relative flex-1">
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            <input type="text" placeholder="Search..." className="w-full p-2 pl-10 rounded-sm border border-gray-300 bg-white" />
          </div>

          {/* Sort Button Container */}
          <div className="relative">
            <button
              onClick={() => { setShowSort(!showSort); setShowFilter(false); }}
              className="bg-[#C2185B] text-white px-8 py-2 rounded-sm font-bold text-sm border-2 border-black"
            >
              ↕ Sort
            </button>
            {showSort && <SortDropdown onClose={() => setShowSort(false)} />}
          </div>

          {/* Filter Button Container */}
          <div className="relative">
            <button
              onClick={() => { setShowFilter(!showFilter); setShowSort(false); }}
              className="bg-[#C2185B] text-white px-8 py-2 rounded-sm font-bold text-sm border-2 border-black"
            >
              Y Filter
            </button>
            {showFilter && <FilterModal onClose={() => setShowFilter(false)} />}
          </div>
        </div>

        <div className="w-full">
          {loading ? (
            <div className="text-center py-20 font-bold text-xl animate-pulse">Loading pets from server...</div>
          ) : error ? (
            <div className="text-center py-20 text-red-600 font-bold">{error}</div>
          ) : (
            <>
              {/* Cats Section */}
              {cats.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-xl font-bold mb-4 text-[#2D2D2D]">Cats</h2>
                  <div className="flex flex-wrap gap-8">
                    {cats.map((item) => (
                      <PetCard key={item._id} {...item} onClick={() => setSelectedPet(item)} />
                    ))}
                  </div>
                </section>
              )}

              {/* Dogs Section */}
              {dogs.length > 0 && (
                <section className="mb-12 pt-6 border-t border-gray-400">
                  <h2 className="text-xl font-bold mb-4 text-[#2D2D2D]">Dogs</h2>
                  <div className="flex flex-wrap gap-8">
                    {dogs.map((item) => (
                      <PetCard key={item._id} {...item} onClick={() => setSelectedPet(item)} />
                    ))}
                  </div>
                </section>
              )}

              {/* Rabbits Section */}
              {rabbits.length > 0 && (
                <section className="mb-12 pt-6 border-t border-gray-400">
                  <h2 className="text-xl font-bold mb-4 text-[#2D2D2D]">Rabbits</h2>
                  <div className="flex flex-wrap gap-8">
                    {rabbits.map((item) => (
                      <PetCard key={item._id} {...item} onClick={() => setSelectedPet(item)} />
                    ))}
                  </div>
                </section>
              )}

              {pets.length === 0 && (
                <div className="text-center py-20 text-gray-500 italic">No furry friends currently available.</div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );

}
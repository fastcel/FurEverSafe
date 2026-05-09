import React, { useState } from 'react';
import Layout from '../../components/layout';
import PetCard from '../../components/PetCard';
import PetModal from '../../components/PetModal'; // <--- ADD THIS IMPORT
import SortDropdown from '../../components/SortDropdown'; // New
import FilterModal from '../../components/DashboardFilterModal'; // New

export default function CitizenDashboard() {
  const [selectedPet, setSelectedPet] = useState(null);
  const [showSort, setShowSort] = useState(false); // Toggle Sort
  const [showFilter, setShowFilter] = useState(false); // Toggle Filter

  // Sample data updated to match different animals
  const cats = Array(5).fill({ name: "Luna", age: "3 months", gender: "female", breed: "Ragdoll", location: "Lahore", image: "https://placecats.com/300/200" });
  const dogs = Array(4).fill({ name: "Max", age: "2 years", gender: "male", breed: "Golden Retriever", location: "Karachi", image: "https://placedog.net/300/200" });
  const rabbits = Array(4).fill({ name: "Snowy", age: "5 months", gender: "female", breed: "Angora", location: "Islamabad", image: "https://placecats.com/301/200" });


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

        {/* 3. Scrollable Content Section */}
        <div className="w-full">
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4 text-[#2D2D2D]">Cats</h2>
            <div className="flex flex-wrap gap-8">
              {cats.map((item, i) => <PetCard key={`cat-${i}`} {...item} onClick={() => setSelectedPet(item)} />)}
            </div>
          </section>

          {/* Dogs Section */}
          <section className="mb-12 pt-6 border-t border-gray-400">
            <h2 className="text-xl font-bold mb-4 text-[#2D2D2D]">Dogs</h2>
            <div className="flex flex-wrap gap-5">
              {dogs.map((item, i) => <PetCard key={`dog-${i}`} {...item} onClick={() => setSelectedPet(item)} />)}
            </div>
          </section>

          {/* Rabbits Section */}
          <section className="mb-12 pt-6 border-t border-gray-400">
            <h2 className="text-xl font-bold mb-4 text-[#2D2D2D]">Rabbits</h2>
            <div className="flex flex-wrap gap-5">
              {rabbits.map((item, i) => <PetCard key={`rabbit-${i}`} {...item} onClick={() => setSelectedPet(item)} />)}
            </div>
          </section>
          {/* ... other sections (Dogs, Rabbits) ... */}
        </div>
      </div>
    </Layout>
  );

}
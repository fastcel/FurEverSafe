import React, { useState } from 'react';
import Layout from '../../components/layout';
import PetCard from '../../components/PetCard';
import PetFormModal from '../../components/PetFormModal';
import SortDropdown from '../../components/SortDropdown';
import FilterModal from '../../components/DashboardFilterModal';
import EditPetModal from '../../components/EditPetModal';

export default function NGODashboard() {
    const [showForm, setShowForm] = useState(false); // State for "Add Pet" modal
    const [showSort, setShowSort] = useState(false);
    const [showFilter, setShowFilter] = useState(false);

    // State to track which pet is being edited
    const [editingPet, setEditingPet] = useState(null);

    // Sample data for the NGO view
    const cats = Array(4).fill({
        name: "Luna",
        age: "3 years",
        breed: "Ragdoll",
        location: "Lahore",
        image: "https://placecats.com/300/200",
        type: "Cat",
        status: "Partially Vaccinated",
        description: "Luna is a very friendly and calm cat looking for a forever home."
    });

    const dogs = Array(4).fill({
        name: "Max",
        age: "2 years",
        breed: "Golden Retriever",
        location: "Karachi",
        image: "https://placedog.net/300/200",
        type: "Dog",
        status: "Fully Vaccinated",
        description: "Max is energetic, loves to play fetch, and is great with kids."
    });

    return (
        <Layout>
            <div className="w-full relative min-h-screen">

                {/* 1. Add Pet Modal (Floating + button) */}
                {showForm && <PetFormModal onClose={() => setShowForm(false)} />}

                {/* 2. Edit Pet Modal (Triggered by Card Edit button) */}
                {editingPet && (
                    <EditPetModal
                        pet={editingPet}
                        onClose={() => setEditingPet(null)}
                    />
                )}

                {/* Search & Actions Header */}
                <div className="flex items-center gap-4 mb-8 w-full relative">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Search pets..."
                            className="w-full p-2 pl-10 rounded-sm border border-gray-300 bg-white focus:outline-none"
                        />
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => { setShowSort(!showSort); setShowFilter(false); }}
                            className="bg-[#C2185B] text-white px-8 py-1 rounded-sm font-bold border-2 border-black"
                        >
                            Sort
                        </button>
                        {showSort && <SortDropdown onClose={() => setShowSort(false)} />}
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => { setShowFilter(!showFilter); setShowSort(false); }}
                            className="bg-[#C2185B] text-white px-8 py-1 rounded-sm font-bold border-2 border-black"
                        >
                            Filter
                        </button>
                        {showFilter && <FilterModal onClose={() => setShowFilter(false)} />}
                    </div>
                </div>

                {/* Pet Sections */}
                <div className="space-y-12">
                    {/* Cats Section */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 text-[#2D2D2D]">Cats</h2>
                        <div className="flex flex-wrap gap-8">
                            {cats.map((cat, i) => (
                                <PetCard
                                    key={`cat-${i}`}
                                    {...cat}
                                    isAdmin={true}
                                    onEdit={() => setEditingPet(cat)} // Opens EditPetModal
                                />
                            ))}
                        </div>
                    </section>

                    {/* Dogs Section */}
                    <section className="pt-6 border-t border-gray-300">
                        <h2 className="text-xl font-bold mb-4 text-[#2D2D2D]">Dogs</h2>
                        <div className="flex flex-wrap gap-8">
                            {dogs.map((dog, i) => (
                                <PetCard
                                    key={`dog-${i}`}
                                    {...dog}
                                    isAdmin={true}
                                    onEdit={() => setEditingPet(dog)} // Opens EditPetModal
                                />
                            ))}
                        </div>
                    </section>
                </div>

                {/* Floating Add Button */}
                <button
                    onClick={() => setShowForm(true)}
                    title="Add New Pet"
                    className="fixed bottom-10 right-10 w-16 h-16 bg-[#C2185B] text-white rounded-full text-4xl flex items-center justify-center border-4 border-white shadow-lg hover:scale-110 active:scale-95 transition-transform z-40"
                >
                    +
                </button>
            </div>
        </Layout>
    );
}
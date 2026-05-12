import React, { useState } from 'react';
import Layout from '../../components/Layout';
import NGOAdoptionItem from '../../components/NGOAdoptionItem';
import ApplicantListing from './ApplicantListing'; // Import the detail view
import AdopterDetailsModal from '../../components/AdopterDetailsModal';

export default function NGOAdoptions() {
    const [activeTab, setActiveTab] = useState('ongoing');
    const [selectedAdopter, setSelectedAdopter] = useState(null);

    // NEW STATE: Tracks which pet's applications we are currently looking at
    const [viewingApplicantsFor, setViewingApplicantsFor] = useState(null);

    const ongoingRequests = [
        { id: 1, petName: "Milo", breed: "Ginger", age: "3 years", location: "Lahore", newCount: 2, totalApplications: 11, image: "https://placecats.com/300/200" },
        { id: 2, petName: "Oliver", breed: "Siamese", age: "3 years", location: "Lahore", newCount: 1, totalApplications: 10, image: "https://placecats.com/301/201" },
        { id: 3, petName: "Willow", breed: "Persian", age: "3 years", location: "Lahore", newCount: 3, totalApplications: 4, image: "https://placecats.com/302/202" },
    ];

    const acceptedRequests = [
        { id: 4, petName: "Jim", breed: "Sphynx", age: "3 years", location: "Lahore", adopter: "Sarah Khan", image: "https://placecats.com/303/203" }
    ];

    // Logic to switch back to the main list
    if (viewingApplicantsFor) {
        return (
            <ApplicantListing
                pet={viewingApplicantsFor}
                onBack={() => setViewingApplicantsFor(null)}
            />
        );
    }

    return (
    <Layout>
        <div className="w-full px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-black text-primary">Adoptions</h1>
                <button className="bg-[#C2185B] text-white px-8 py-2 rounded-sm font-bold border-2 border-black">
                    Filter
                </button>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-3 mb-8">
                <button
                    onClick={() => setActiveTab('ongoing')}
                    className={`px-8 py-2 rounded-sm font-bold border-2 border-black transition-all ${activeTab === 'ongoing' ? 'bg-[#C2185B] text-white' : 'bg-white text-gray-400'}`}
                >
                    Ongoing
                </button>
                <button
                    onClick={() => setActiveTab('accepted')}
                    className={`px-8 py-2 rounded-sm font-bold border-2 border-black transition-all ${activeTab === 'accepted' ? 'bg-[#C2185B] text-white' : 'bg-white text-gray-400'}`}
                >
                    Accepted
                </button>
            </div>

            {/* Content List */}
            <div className="space-y-5">
                {activeTab === 'ongoing' ? (
                    ongoingRequests.map(pet => (
                        <NGOAdoptionItem
                            key={pet.id}
                            data={pet}
                            onViewApplications={() => setViewingApplicantsFor(pet)}
                        />
                    ))
                ) : (
                    acceptedRequests.map(pet => (
                        <div key={pet.id} className="bg-[#DED9C4] border-2 border-black p-6 flex items-center justify-between rounded-lg shadow-sm">
                            <div className="flex items-center gap-8">
                                <img src={pet.image} className="w-28 h-28 border-2 border-black object-cover rounded-md" alt="" />
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-[#6A1B9A]">{pet.petName}</h3>
                                    <p className="text-base font-medium text-[#6A1B9A]">{pet.breed} • {pet.age}</p>
                                    <p className="text-base font-bold text-[#6A1B9A]">{pet.location}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedAdopter(pet)}
                                className="bg-[#EDEFD7] text-black px-6 py-2 border-2 border-black font-bold text-sm rounded-sm hover:bg-white transition-all"
                            >
                                View Details
                            </button>
                        </div>
                    ))
                )}
            </div>

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
import React, { useState } from 'react';
import Layout from '../../components/layout';
import AdoptionItem from '../../components/AdoptionItem';
import AdoptionFilterModal from '../../components/AdoptionFilterModal';

export default function AdoptionsPage() {
    const [activeTab, setActiveTab] = useState('ongoing');
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [targetPet, setTargetPet] = useState("");
    const [showFilter, setShowFilter] = useState(false);

    const ongoingAdoptions = [
        { id: 1, name: "Milo", breed: "Ginger", age: "3 years", location: "Lahore", status: "Processing", image: "https://placecats.com/150/150" },
        { id: 2, name: "Oliver", breed: "Siamese", age: "3 years", location: "Lahore", status: "Approved", image: "https://placecats.com/151/151" },
        { id: 3, name: "Willow", breed: "Persian", age: "3 years", location: "Lahore", status: "Processing", image: "https://placecats.com/152/152" },
        { id: 4, name: "Jim", breed: "Sphynx", age: "3 years", location: "Lahore", status: "Approved", image: "https://placecats.com/153/153" },
    ];

    const previousAdoptions = [
        { id: 5, name: "Rocky", breed: "Pug", age: "3 years", location: "Lahore", status: "Rejected", image: "https://placedog.net/150/150" },
        { id: 6, name: "Bella", breed: "Pomeranian", age: "5 years", location: "Sheikhupura", status: "Rejected", image: "https://placedog.net/151/151" },
        { id: 7, name: "Mocha", breed: "Persian", age: "1 year", location: "Karachi", status: "Cancelled", image: "https://placecats.com/154/154" },
    ];

    const handleCancelClick = (name) => {
        setTargetPet(name);
        setShowCancelModal(true);
    };

    return (
        <Layout>
            <div className="w-full relative">
                <h1 className="text-2xl font-bold text-[#6A1B9A] mb-6">Adoptions</h1>

                {/* Tab Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveTab('ongoing')}
                            className={`px-6 py-1 rounded-sm font-bold border-2 border-black transition-all ${activeTab === 'ongoing' ? 'bg-[#C2185B] text-white' : 'bg-white text-gray-400'}`}
                        >
                            Ongoing
                        </button>
                        <button
                            onClick={() => setActiveTab('previous')}
                            className={`px-6 py-1 rounded-sm font-bold border-2 border-black transition-all ${activeTab === 'previous' ? 'bg-[#C2185B] text-white' : 'bg-white text-gray-400'}`}
                        >
                            Previous
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <div className="relative">
                            <button
                                onClick={() => { setShowFilter(!showFilter); setShowSort(false); }}
                                className="bg-[#C2185B] text-white px-6 py-1 rounded-sm font-bold border-2 border-black"
                            >
                                Filter
                            </button>
                            {showFilter && <AdoptionFilterModal onClose={() => setShowFilter(false)} />}
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="space-y-4">
                    {(activeTab === 'ongoing' ? ongoingAdoptions : previousAdoptions).map(pet => (
                        <AdoptionItem
                            key={pet.id}
                            pet={pet}
                            onCancel={() => handleCancelClick(pet.name)}
                        />
                    ))}
                </div>

                {/* Cancellation Modal */}
                {showCancelModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="bg-[#EDEFD7] p-8 border-2 border-black rounded-sm max-w-sm text-center">
                            <div className="text-orange-500 text-6xl mb-4">⚠</div>
                            <h3 className="text-xl font-bold text-[#C2185B] mb-4">Are you sure you want to cancel your adoption request??</h3>
                            <p className="text-sm mb-8">Are you sure you want to withdraw your application for {targetPet}? This will remove you from the waiting list and notify the NGO that you are no longer interested.</p>
                            <div className="flex gap-4">
                                <button onClick={() => setShowCancelModal(false)} className="flex-1 bg-red-400 py-2 border-2 border-black rounded-sm font-bold">No, Go Back</button>
                                <button onClick={() => { setShowCancelModal(false); setShowSuccessModal(true); }} className="flex-1 bg-green-200 py-2 border-2 border-black rounded-sm font-bold">Yes, I'm Sure</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Modal */}
                {showSuccessModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-[#EDEFD7] p-8 border-2 border-black rounded-sm text-center">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-white text-3xl">✔</span>
                            </div>
                            <p className="text-[#C2185B] font-bold text-xl mb-6">Adoption Request successfully cancelled.</p>
                            <button onClick={() => setShowSuccessModal(false)} className="bg-[#C2185B] text-white px-12 py-2 border-2 border-black rounded-sm font-bold">Return</button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
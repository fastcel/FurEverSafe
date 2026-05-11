import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import AdoptionItem from '../../components/AdoptionItem';
import AdoptionFilterModal from '../../components/AdoptionFilterModal';

export default function AdoptionsPage() {
    const [activeTab, setActiveTab] = useState('ongoing');
    const [adoptions, setAdoptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [targetPet, setTargetPet] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [setShowSort] = useState(false);

    useEffect(() => {
        const fetchAdoptions = async () => {
            try {
                setLoading(true);
                // 1. Get the current user's ID (stored during login)
                const user_id = localStorage.getItem('user_id'); 
                
                // 2. Call your REST API with query params
                const response = await axios.get(`http://localhost:5000/api/adoption/my-applications`, {
                    params: {
                        user_id: user_id,
                        tab: activeTab // This sends either 'ongoing' or 'previous'
                    }
                });

                // 3. Update state with the rows from adoption.service.js
                setAdoptions(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load adoptions:", err);
                setLoading(false);
            }
        };

        fetchAdoptions();
    }, [activeTab]); // Re-fetch whenever user clicks a different tab

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

                {/* The Dynamic List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-10 font-bold text-gray-500">Loading your applications...</div>
                    ) : adoptions.length > 0 ? (
                        adoptions.map(app => (
                            <AdoptionItem
                                key={app.application_id}
                                pet={{
                                    name: app.pet_name,
                                    breed: app.breed,
                                    age: app.age,
                                    location: app.city,
                                    status: app.status.charAt(0).toUpperCase() + app.status.slice(1), // Capitalize
                                    image: "https://placecats.com/150/150" // You can add image_url if you join pet_images
                                }}
                                onCancel={() => handleCancelClick(app.pet_name)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-300">
                            No {activeTab} applications found.
                        </div>
                    )}
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
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import ConfirmationModal from '../../components/ConfirmationModal';

export default function ApplicantListing({ pet, onBack }) {
    const [selectedName, setSelectedName] = useState("Sarah Khan");
    const [action, setAction] = useState(null);

    const applicants = ["Sarah Khan", "Ayesha Mir", "Romessa", "Abdullah", "Ahmed Amir", "Fatima Ali", "Rija Tayyab", "Ibrahim", "Minahil", "Hamza Ali", "Waleed"];

    return (
        <Layout>
            <div className="w-full">
                {/* Back Link */}
                <button
                    onClick={onBack}
                    className="mb-4 text-[#C2185B] font-bold flex items-center gap-2 hover:underline"
                >
                    ← Back to Adoption Requests
                </button>

                <h1 className="text-2xl font-bold text-[#6A1B9A] mb-4">Applicant Listing for {pet.petName}</h1>

                <div className="flex border-2 border-black min-h-[500px]">
                    {/* Left Panel: Names */}
                    <div className="w-64 bg-[#C2185B] border-r-2 border-black overflow-y-auto">
                        {applicants.map((name) => (
                            <button
                                key={name}
                                onClick={() => setSelectedName(name)}
                                className={`w-full text-left p-4 font-bold border-b border-black/20 transition-colors ${selectedName === name ? "bg-[#8E1042] text-white" : "text-white/80 hover:bg-[#A3154D]"
                                    }`}
                            >
                                {name}
                            </button>
                        ))}
                    </div>

                    {/* Right Panel: Details (Reuse your exact AdopterDetails layout here) */}
                    <div className="flex-1 bg-[#EDEFD7] p-8">
                        <div className="flex justify-center gap-4 mb-8">
                            <button onClick={() => setAction('accept')} className="bg-[#A8E6A1] px-8 py-2 border-2 border-black font-bold">Accept Applicant</button>
                            <button onClick={() => setAction('reject')} className="bg-[#D98282] px-8 py-2 border-2 border-black font-bold">Reject Applicant</button>
                        </div>

                        {/* Insert your Application Details View Content here... */}
                        <h2 className="text-2xl font-bold text-[#C2185B] mb-6">Application Details for {selectedName}</h2>
                        {/* ... (Rest of the details form) ... */}
                    </div>
                </div>
            </div>

            {action && (
                <ConfirmationModal
                    type={action}
                    onClose={() => setAction(null)}
                    onConfirm={() => {
                        alert(`${selectedName} ${action}ed!`);
                        setAction(null);
                    }}
                />
            )}
        </Layout>
    );
}
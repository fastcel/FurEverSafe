import React from 'react';

const AdopterDetailsModal = ({ adopter, onClose }) => {
    if (!adopter) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#EDEFD7] w-full max-w-3xl rounded-sm border-2 border-black relative overflow-hidden shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 bg-[#C2185B] text-white w-10 h-10 flex items-center justify-center text-2xl font-bold border-l-2 border-b-2 border-black hover:bg-red-700 transition-colors z-10"
                >
                    ×
                </button>

                <div className="p-8">
                    <h2 className="text-3xl font-bold text-[#C2185B] mb-8 pr-10">
                        Application Details for {adopter.full_name || adopter.applicant_name}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-[#6A1B9A] border-b border-black/10">Personal Information</h3>
                            <div className="text-sm space-y-2">
                                <p><strong>Contact Number:</strong> {adopter.contact_number || '—'}</p>
                                <p><strong>Email Address:</strong> {adopter.email || '—'}</p>
                                <p className="text-[#C2185B] font-bold mt-2 italic">
                                    *Would prefer to be contacted via <span className="underline">{adopter.preferred_contact_method || '—'}</span>
                                </p>
                            </div>

                            <h3 className="text-xl font-bold text-[#6A1B9A] border-b border-black/10 pt-4">Living Conditions</h3>
                            <div className="text-sm space-y-1.5">
                                <p><strong>House Type:</strong> {adopter.house_type?.replace(/_/g, ' ') || '—'}</p>
                                <p><strong>Has Children at Home:</strong> {adopter.has_children ? 'Yes' : 'No'}</p>
                                <p><strong>Other Pets:</strong> {adopter.other_pets?.join(', ') || 'None'}</p>
                                <p>
                                <strong>Monthly Income:</strong>{" "}
                                {adopter.monthly_income_range
                                    ? adopter.monthly_income_range.replace("_", " - ").replace(/_/g, " ")
                                    : "—"}
                                </p>

                                <p>
                                <strong>Budget for Pet:</strong>{" "}
                                {adopter.monthly_budget_range
                                    ? adopter.monthly_budget_range.replace("_", " - ").replace(/_/g, " ")
                                    : "—"}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col justify-start items-end space-y-4 pt-12">
                            <p className="text-[#6A1B9A] font-bold mr-2">
                                Want to contact {adopter.full_name || adopter.applicant_name}?
                            </p>
                            <button className="flex items-center gap-2 bg-white border-2 border-[#C2185B] text-black px-4 py-1.5 rounded-full text-sm font-bold hover:bg-gray-50 transition-all w-48 shadow-sm">
                                <span className="bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">📞</span>
                                Contact via Phone
                            </button>
                            <button className="flex items-center gap-2 bg-white border-2 border-[#C2185B] text-black px-4 py-1.5 rounded-full text-sm font-bold hover:bg-gray-50 transition-all w-48 shadow-sm">
                                <span className="bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">✉</span>
                                Contact via Email
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-[#6A1B9A]">Adoption Motivation</h3>
                        <p className="text-sm font-bold">
                            Why do you want to adopt {adopter.pet_name}?
                            <span className="text-[#C2185B]">*</span>
                        </p>
                        <div className="w-full bg-[#DED9C4] border-2 border-black p-4 rounded-sm shadow-inner min-h-[150px] relative">
                            <p className="text-sm leading-relaxed text-gray-800">
                                {adopter.motivation || '—'}
                            </p>
                            <div className="absolute right-0 top-0 bottom-0 w-4 bg-gray-300 border-l-2 border-black flex items-start justify-center pt-1">
                                <div className="w-2 h-1/2 bg-gray-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdopterDetailsModal;
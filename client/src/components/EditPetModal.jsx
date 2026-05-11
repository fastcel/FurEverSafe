import React, { useState } from 'react';

// We pass the 'pet' to edit and 'onClose' to hide the modal
const EditPetModal = ({ pet, onClose }) => {
    if (!pet) return null; // Safety check

    // Initialize state with the pet's existing data so the inputs are pre-filled
    const [formData, setFormData] = useState({
        name: pet.name || '',
        type: pet.type || 'Cat', // Default type
        breed: pet.breed || '',
        ageYears: pet.ageYears || '0',
        ageMonths: pet.ageMonths || '3',
        status: pet.status || 'Partially Vaccinated',
        description: pet.description || `${pet.name} is a gentle, playful companion.`,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        console.log("Saving updated pet data:", formData);
        // In a real app, you would send this 'formData' to your backend API here
        onClose(); // Close the modal after saving
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-[#EDEFD7] w-full max-w-5xl rounded-sm border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-6 text-3xl font-bold hover:text-red-600 transition-colors">×</button>

                {/* Header */}
                <div className="bg-[#DED9C4] p-5 text-center border-b-2 border-black">
                    <h2 className="text-3xl font-bold text-[#6A1B9A]">Edit Pet Details</h2>
                </div>

                {/* Form Body */}
                <div className="p-10 grid grid-cols-2 gap-x-12 gap-y-6">

                    {/* Left Column */}
                    <div className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-bold mb-1">Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full border-2 border-black p-2.5 bg-white text-sm"
                            />
                        </div>

                        {/* Animal Type */}
                        <div>
                            <label className="block text-sm font-bold mb-1">Animal Type <span className="text-red-500">*</span></label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="w-full border-2 border-black p-2.5 bg-white text-sm appearance-none cursor-pointer"
                            >
                                <option>Monkey</option>
                                <option>Cat</option>
                                <option>Dog</option>
                                <option>Duck</option>
                            </select>
                        </div>

                        {/* Photo Upload Area */}
                        <div>
                            <label className="block text-sm font-bold mb-1">Photos (at least three)</label>
                            <div className="border-2 border-dashed border-black h-48 flex flex-col items-center justify-center bg-[#DED9C4] cursor-pointer hover:bg-gray-200 transition">
                                <span className="text-4xl text-green-700">⤒</span>
                                <p className="text-[11px] mt-3 text-center text-gray-700 leading-relaxed px-4">
                                    Click or drag photos/videos here<br />JPG, PNG, MP4-max 20MB each
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-5">
                        {/* Adoption Status */}
                        <div>
                            <label className="block text-sm font-bold mb-1.5">Adoption Status <span className="text-red-500">*</span></label>
                            <div className="flex gap-4 text-[11px]">
                                {['Fully Vaccinated', 'Partially Vaccinated', 'Not Vaccinated'].map(status => (
                                    <label key={status} className="flex items-center gap-1.5 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            value={status}
                                            checked={formData.status === status}
                                            onChange={handleInputChange}
                                            className="accent-[#C2185B]"
                                        />
                                        {status}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-bold mb-1">Description <span className="text-red-500">*</span></label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full h-28 border-2 border-black p-3 bg-white text-sm resize-none"
                            ></textarea>
                        </div>

                        {/* Breed */}
                        <div>
                            <label className="block text-sm font-bold mb-1">Breed <span className="text-red-500">*</span></label>
                            <select
                                name="breed"
                                value={formData.breed}
                                onChange={handleInputChange}
                                className="w-full border-2 border-black p-2.5 bg-white text-sm appearance-none cursor-pointer"
                            >
                                <option>RagDoll</option>
                                <option>Persian</option>
                                <option>Russian Blue</option>
                                <option>Siamese</option>
                            </select>
                        </div>

                        {/* Age */}
                        <div>
                            <label className="block text-sm font-bold mb-1">Age <span className="text-red-500">*</span></label>
                            <div className="flex gap-4">
                                {['Years', 'Months'].map(unit => (
                                    <select key={unit} name={`age${unit}`} value={formData[`age${unit}`]} onChange={handleInputChange} className="flex-1 border-2 border-black p-2 bg-white text-sm">
                                        {Array.from({ length: 13 }, (_, i) => (
                                            <option key={i} value={i}>{i} {unit}</option>
                                        ))}
                                    </select>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-8 border-t-2 border-black flex justify-end gap-6">
                    <button onClick={onClose} className="bg-white px-10 py-2.5 font-bold border-2 border-black rounded-sm active:translate-y-0.5 transition-all">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="bg-[#C2185B] text-white px-10 py-2.5 font-bold border-2 border-black rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 transition-all">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPetModal;
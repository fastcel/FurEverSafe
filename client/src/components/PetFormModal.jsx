import React, { useState } from 'react';

export default function PetFormModal({ onClose }) {
    const [submitted, setSubmitted] = useState(false);

    if (submitted) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-[#EDEFD7] p-10 rounded-sm border-2 border-black text-center max-w-sm">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-3xl">✔</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#C2185B] mb-2">Pet successfully put up for adoption!</h3>
                    <p className="text-sm mb-6">Hold tight while we receive adoption applications</p>
                    <button onClick={onClose} className="bg-[#C2185B] text-white px-10 py-2 font-bold border-2 border-black">Close</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
            <div className="bg-[#EDEFD7] w-full max-w-4xl rounded-sm border-2 border-black m-4">
                <div className="bg-[#DED9C4] p-4 text-center text-2xl font-bold border-b-2 border-black">
                    Put up for adoption
                </div>

                <div className="p-8 grid grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold">Name <span className="text-red-500">*</span></label>
                            <input type="text" placeholder="Please name the pet..." className="w-full border border-black p-2 bg-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold">Animal Type <span className="text-red-500">*</span></label>
                            <select className="w-full border border-black p-2 bg-white">
                                <option>Monkey</option><option>Cat</option><option>Dog</option><option>Duck</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold">Photos (at least three)</label>
                            <div className="border-2 border-dashed border-black h-40 flex flex-col items-center justify-center bg-[#DED9C4] cursor-pointer hover:bg-gray-200 transition">
                                <span className="text-3xl text-green-700">⤒</span>
                                <p className="text-[10px] mt-2 text-center">Click or drag photos/videos here<br />JPG, PNG, MP4-max 20MB each</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold">Adoption Status <span className="text-red-500">*</span></label>
                            <div className="flex gap-4 text-[10px]">
                                <label><input type="radio" name="status" /> Fully Vaccinated</label>
                                <label><input type="radio" name="status" /> Partially Vaccinated</label>
                                <label><input type="radio" name="status" /> Not Vaccinated</label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold">Description <span className="text-red-500">*</span></label>
                            <textarea placeholder="Please describe the pet..." className="w-full h-24 border border-black p-2 bg-white"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-bold">Breed <span className="text-red-500">*</span></label>
                            <select className="w-full border border-black p-2 bg-white">
                                <option>RagDoll</option><option>Persian</option><option>Russian</option>
                            </select>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-bold">Age <span className="text-red-500">*</span></label>
                                <div className="flex gap-2">
                                    <select className="flex-1 border border-black p-1 bg-white text-xs"><option>Years</option></select>
                                    <select className="flex-1 border border-black p-1 bg-white text-xs"><option>Months</option></select>
                                </div>
                            </div>
                            <button
                                onClick={() => setSubmitted(true)}
                                className="self-end bg-[#C2185B] text-white px-8 py-2 font-bold border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
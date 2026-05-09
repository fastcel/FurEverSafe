import React, { useState } from 'react';

const AdoptionFilterModal = ({ onClose }) => {
    const categories = ["Processing", "Approved", "Rejected", "Cancelled"];

    const [selected, setSelected] = useState("Processing");

    return (
        <div className="absolute right-0 mt-2 w-48 bg-[#EDEFD7] border-2 border-black z-30 p-3">

            <div className="bg-[#DED9C4] -m-3 mb-3 p-2 text-center font-bold border-b-2 border-black text-xs">
                Filter by Status
            </div>

            <div className="flex flex-col gap-2">
                {categories.map((status) => (
                    <button
                        key={status}
                        onClick={() => setSelected(status)}
                        className={`text-xs p-2 rounded-md border text-left flex justify-between items-center transition-all ${selected === status
                                ? "bg-[#C2185B] text-white border-black"
                                : "bg-white text-black border-gray-300 hover:border-black"
                            }`}
                    >
                        {status}

                        {selected === status && (
                            <span className="ml-1 text-[10px] border rounded-full px-1">
                                ×
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-2 mt-4">
                <button
                    onClick={onClose}
                    className="w-full bg-[#C2185B] text-white py-1 rounded-sm font-bold border-2 border-black text-[10px]"
                >
                    Apply
                </button>

                <button
                    onClick={onClose}
                    className="w-full bg-white text-black py-1 rounded-sm font-bold border-2 border-black text-[10px]"
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default AdoptionFilterModal;
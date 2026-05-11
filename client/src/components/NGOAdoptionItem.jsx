import React from 'react';

const NGOAdoptionItem = ({ data, onViewApplications }) => {
    return (
        <div className="bg-[#DED9C4] border-2 border-black p-4 flex items-center justify-between mb-4">
            <div className="flex items-center gap-6">
                <img src={data.image} alt={data.petName} className="w-24 h-24 border-2 border-black object-cover" />
                <div>
                    <h3 className="text-xl font-bold text-[#6A1B9A]">{data.petName}</h3>
                    <p className="text-sm font-medium text-[#6A1B9A]">{data.breed} <span className="mx-2">•</span> {data.age}</p>
                    <p className="text-sm font-bold text-[#6A1B9A]">{data.location}</p>
                </div>
            </div>

            <div className="flex flex-col items-end justify-between h-24">
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-[#C2185B] font-bold text-sm">
                        <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">!</span>
                        {data.newCount} new
                    </div>
                    <p className="text-2xl font-bold text-[#C2185B]">{data.totalApplications} Applications</p>
                </div>

                <button
                    onClick={onViewApplications}
                    className="bg-[#EDEFD7] text-black px-4 py-1.5 border-2 border-black font-bold text-xs flex items-center gap-2 hover:bg-white transition-all shadow-sm"
                >
                    View All Applications <span>➜</span>
                </button>
            </div>
        </div>
    );
};

export default NGOAdoptionItem;
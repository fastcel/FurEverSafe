import React from 'react';

const NGOAdoptionItem = ({ data, onViewApplications }) => {
    return (
        <div className="bg-[#DED9C4] border-2 border-black p-6 flex items-center justify-between rounded-lg shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-8">
                <img 
                    src={data.image || 'https://placecats.com/300/200'} 
                    alt={data.petName} 
                    className="w-28 h-28 border-2 border-black object-cover rounded-md flex-shrink-0" 
                />
                <div className="space-y-1">
                    <h3 className="text-2xl font-black text-[#6A1B9A]">{data.petName}</h3>
                    <p className="text-base font-medium text-[#6A1B9A]">
                        {data.breed} <span className="mx-2">•</span> {data.age}
                    </p>
                    <p className="text-base font-bold text-[#6A1B9A]">{data.location}</p>
                </div>
            </div>

            <div className="flex flex-col items-end justify-between h-28 py-1">
                <div className="flex flex-col items-end gap-1">
                    {data.newCount > 0 && (
                        <div className="flex items-center gap-2 text-[#C2185B] font-bold text-sm">
                            <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black">!</span>
                            {data.newCount} new
                        </div>
                    )}
                    <p className="text-3xl font-black text-[#C2185B]">
                        {data.totalApplications ?? 0} Applications
                    </p>
                </div>

                <button
                    onClick={onViewApplications}
                    className="bg-[#EDEFD7] text-black px-6 py-2 border-2 border-black font-bold text-sm flex items-center gap-2 hover:bg-white transition-all shadow-sm rounded-sm"
                >
                    View All Applications <span>➜</span>
                </button>
            </div>
        </div>
    );
};

export default NGOAdoptionItem;
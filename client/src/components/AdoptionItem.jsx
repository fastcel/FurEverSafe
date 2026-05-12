import React, { useState } from "react";

const AdoptionItem = ({ pet, onCancel }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusColors = {
    Processing: "bg-[#FFE082]",
    Approved: "bg-[#81C784]",
    Rejected: "bg-[#E57373]",
    Cancelled: "bg-gray-400",
  };

  return (
    <div className="bg-[#DED9C4] border-2 border-black overflow-hidden">
      <div className="flex p-4 items-center">
        <img
          src={pet.image}
          alt={pet.name}
          className="w-24 h-24 object-cover border-2 border-black mr-6"
        />

        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#6A1B9A]">{pet.name}</h3>
          <p className="text-sm">
            {pet.breed} <span className="mx-2">•</span> {pet.age}
          </p>
          <p className="text-sm font-bold">{pet.location}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-4 py-1 rounded-full text-xs font-bold border border-black/20 ${statusColors[pet.status]}`}
          >
            {pet.status}
          </span>

          {pet.status === "Processing" && (
            <button
              onClick={onCancel}
              className="bg-red-600 text-white text-xs px-6 py-1 rounded-sm border border-black font-bold active:shadow-none active:translate-y-[1px]"
            >
              Cancel
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold flex items-center gap-1 mt-1 bg-[#C2185B] text-white px-3 py-1 rounded-md hover:bg-[#a3154d] transition-all"
          >
            {isExpanded ? (
              <>
                Show Less <span className="text-[10px]">⌃</span>
              </>
            ) : (
              <>
                View Details <span className="text-[10px]">⌄</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-[#EDEFD7] p-4 border-t-2 border-black/20 mx-4 mb-4 text-xs leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
          <p className="text-[#6A1B9A] mb-4 italic">
            {pet.name}, rescued from a busy construction site where he was
            hiding in fear, is a plush-coated, cream-colored stray with gentle
            paws. He displays a shy but curious nature, often "talking" with
            soft chirps when it's time for breakfast.
          </p>
          <div className="flex justify-between items-end">
            <div>
              <p>
                <span className="font-bold">Vaccination Status:</span>{" "}
                <span className="text-pink-600">Up to Date</span>
              </p>
              <p>
                <span className="font-bold">Affiliated NGO:</span>{" "}
                <span className="text-pink-600">PawLife</span>
              </p>
            </div>
            {pet.status === "Approved" && (
              <div className="flex items-center gap-2 text-pink-600 font-bold max-w-[200px] text-right">
                <span className="text-xl">⚠</span>
                <span>
                  Ready to Collect! Visit PawLife at your latest to claim{" "}
                  {pet.name} as your own.
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdoptionItem;

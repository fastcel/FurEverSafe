import React from 'react';

const SortDropdown = ({ onClose }) => {
  const options = ["Newest First", "Oldest First", "Closest", "Alphebetical"];

  return (
    <div className="absolute right-0 mt-2 w-64 bg-[#EDEFD7] border-2 border-black z-30 overflow-hidden">
      <div className="bg-[#DED9C4] p-2 text-center font-bold border-b-2 border-black">
        Sort By
      </div>
      <div className="flex flex-col">
        {options.map((opt) => (
          <button 
            key={opt}
            onClick={onClose}
            className="py-3 px-4 text-center border-b border-black last:border-b-0 hover:bg-[#DED9C4] transition-colors"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SortDropdown;
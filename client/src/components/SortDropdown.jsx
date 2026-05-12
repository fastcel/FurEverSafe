import React from "react";

const SORT_OPTIONS = [
  {
    label: "Newest",
    value: "newest",
  },

  {
    label: "Oldest",
    value: "oldest",
  },

  {
    label: "Alphabetical",
    value: "alphabetical",
  },

  {
    label: "Age (Low-High)",
    value: "age_low_high",
  },

  {
    label: "Age (High-Low)",
    value: "age_high_low",
  },
];

const SortDropdown = ({ selectedSort, onClose, onSelect }) => {
  return (
    <div className="absolute right-0 mt-2 w-64 bg-[#EDEFD7] border-2 border-black z-30 overflow-hidden">
      <div className="bg-[#DED9C4] p-2 text-center font-bold border-b-2 border-black">
        Sort By
      </div>

      <div className="flex flex-col">
        {SORT_OPTIONS.map((option) => {
          const isSelected = selectedSort === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onSelect?.(isSelected ? "" : option.value);

                onClose();
              }}
              className={`py-3 px-4 text-center border-b border-black last:border-b-0 transition-colors flex items-center justify-between ${
                isSelected ? "bg-[#C2185B] text-white" : "hover:bg-[#DED9C4]"
              }`}
            >
              <span>{option.label}</span>

              {isSelected && <span className="text-xs">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SortDropdown;

import React, { useState } from 'react';

const FilterModal = ({ onClose }) => {
  const [sections, setSections] = useState([
    { title: "Category", tags: ["Cat", "Dog", "Bird", "Snake"], selected: "Cat" },
    { title: "Upload date", tags: ["Today", "Last Week", "Last Month", "Last Year"], selected: "Last Week" },
    { title: "Breed", tags: ["Siamese", "Spotted", "Tiger", "Persian"], selected: "Persian" },
    { title: "Age", tags: ["<1 year", "1-2 years", "3-7 years", ">7 years"], selected: "3-7 years" },
    { title: "Location", tags: ["Lahore", "Karachi", "Islamabad"], selected: "Karachi" },
  ]);

  const handleSelect = (sectionTitle, tag) => {
    setSections((prev) =>
      prev.map((sec) =>
        sec.title === sectionTitle
          ? { ...sec, selected: tag }
          : sec
      )
    );
  };

  return (
    <div className="absolute right-0 mt-2 w-[800px] bg-[#EDEFD7] border-2 border-black z-30 p-4">

      <div className="bg-[#DED9C4] -m-4 mb-4 p-2 text-center font-bold border-b-2 border-black">
        Filter by
      </div>

      <div className="grid grid-cols-5 gap-4 py-4">
        {sections.map((sec) => (
          <div key={sec.title} className="flex flex-col gap-2">

            <h3 className="font-bold border-b border-black pb-1 mb-2">
              {sec.title}
            </h3>

            {sec.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleSelect(sec.title, tag)}
                className={`text-xs p-1 px-2 rounded-md border text-left flex justify-between items-center transition-all ${sec.selected === tag
                  ? "bg-[#C2185B] text-white border-black"
                  : "bg-white text-black border-gray-300"
                  }`}
              >
                {tag}

                {sec.selected === tag && (
                  <span className="ml-1 text-[10px] border rounded-full px-1">
                    ×
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button className="bg-[#C2185B] text-white px-8 py-1 rounded-md font-bold border-2 border-black  ">
          Apply
        </button>

        <button
          onClick={onClose}
          className="bg-white text-black px-8 py-1 rounded-md font-bold border-2 border-black"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default FilterModal;
import React from "react";
import { useNavigate } from "react-router-dom";

const PetCard = ({
  pet_id,
  listing_id,
  name,
  age,
  gender,
  breed,
  city,
  image,
  onClick,
  isAdmin,
  onEdit,
  isApplied,
}) => {
  const navigate = useNavigate();

  const handleButtonClick = (e) => {
    e.stopPropagation();

    if (isApplied) return;

    if (isAdmin) {
      if (onEdit) onEdit();
    } else {
      navigate(`/adopt/${listing_id}`);
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-[#DED9C4] p-3 rounded-sm w-full cursor-pointer transition-transform hover:scale-105 active:scale-95 border border-transparent hover:border-black/10"
    >
      <img src={image} alt={name} className="w-full h-48 object-cover mb-3" />

      <div className="text-[13px] text-[#4A4A4A] leading-tight space-y-1 px-1">
        <p className="font-bold text-[#6A1B9A]">
          {name}, {age} {gender === "female" ? "♀" : "♂"}
        </p>
        <p className="font-medium">{breed}</p>
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <span>📍</span> {city}
        </p>
      </div>

      <button
        onClick={handleButtonClick}
        disabled={isApplied}
        className={`w-full mt-3 py-1.5 rounded-sm font-bold border border-black transition-all
    ${
      isApplied
        ? "bg-gray-500 cursor-not-allowed"
        : "bg-[#C2185B] hover:bg-[#a3154d] text-white"
    }
  `}
      >
        {isApplied ? "Already Applied" : isAdmin ? "Edit" : "Adopt"}
      </button>
    </div>
  );
};

export default PetCard;

import React from 'react';
import { useNavigate } from "react-router-dom";

const PetCard = ({ name, age, gender, breed, location, image, onClick, isAdmin, onEdit }) => {
    const navigate = useNavigate();

    const handleButtonClick = (e) => {
        e.stopPropagation(); // Prevents the card's main click (opening the info modal)

        if (isAdmin) {
            // If it's an NGO user, trigger the edit function
            if (onEdit) onEdit();
        } else {
            // If it's a Citizen, go to the adoption form
            navigate(`/adopt/${name}`);
        }
    };

    return (
        <div
            onClick={onClick}
            className="bg-[#DED9C4] p-3 rounded-sm w-[210px] cursor-pointer transition-transform hover:scale-105 active:scale-95 border border-transparent hover:border-black/10"
        >
            <img src={image} alt={name} className="w-full h-36 object-cover mb-3" />

            <div className="text-[13px] text-[#4A4A4A] leading-tight space-y-1 px-1">
                <p className="font-bold text-[#6A1B9A]">
                    {name}, {age} {gender === 'female' ? '♀' : '♂'}
                </p>
                <p className="font-medium">{breed}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span>📍</span> {location}
                </p>
            </div>

            <button
                onClick={handleButtonClick}
                className="w-full mt-3 bg-[#C2185B] text-white py-1.5 rounded-sm font-bold border border-black hover:bg-[#a3154d] transition-all"
            >
                {/* DYNAMIC TEXT BASED ON PROP */}
                {isAdmin ? "Edit" : "Adopt"}
            </button>
        </div>
    );
};

export default PetCard;
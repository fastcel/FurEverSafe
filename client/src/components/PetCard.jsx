import React from 'react';
import { useNavigate } from "react-router-dom";


const PetCard = ({ name, age, gender, breed, location, image, onClick }) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={onClick}
            className="bg-[#DED9C4] p-3 rounded-sm w-[210px] shadow-sm cursor-pointer transition-transform hover:scale-105 active:scale-95"
        >
            <img src={image} alt={name} className="w-full h-36 object-cover mb-3" />
            <div className="text-[13px] text-[#4A4A4A] leading-tight space-y-1 px-1">
                <p className="font-bold text-[#6A1B9A]">
                    {name}, {age} {gender === 'female' ? '♀' : '♂'}
                </p>
                <p className="font-medium">{breed}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
                    <span>📍</span> {location} • {age}
                </p>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/adopt/${name}`);
                }}
                className="w-full mt-3 bg-[#C2185B] text-white py-1.5 rounded-sm font-bold border-2 border-black hover:bg-[#a3154d] active:translate-y-0.5 transition-all">
                Adopt
            </button>
        </div>
    );
};

export default PetCard;
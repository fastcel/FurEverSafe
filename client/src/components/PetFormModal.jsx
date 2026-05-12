import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';

const API_ADD = 'http://localhost:5000/api/pets/ngo/add';

const VACC_DB = {
    fully: 'fully_vaccinated',
    partial: 'partially_vaccinated',
    none: 'not_vaccinated',
};

export default function PetFormModal({ onClose }) {
    const [submitted, setSubmitted] = useState(false);
    const [name, setName] = useState('');
    const [petType, setPetType] = useState('Cat');
    const [breed, setBreed] = useState('');
    const [gender, setGender] = useState('male');
    const [city, setCity] = useState('');
    const [ageYears, setAgeYears] = useState('1');
    const [vaccination, setVaccination] = useState('partial');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const fileInputRef = useRef(null);

    const addFiles = useCallback((fileList) => {
        const next = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'));
        if (!next.length) return;
        setFiles((prev) => {
            const merged = [...prev];
            for (const f of next) {
                merged.push({ id: `${f.name}-${f.size}-${merged.length}-${Date.now()}`, file: f });
            }
            return merged;
        });
    }, []);

    const removeFile = (id) => {
        setFiles((prev) => prev.filter((x) => x.id !== id));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addFiles(e.dataTransfer.files);
    };

    const handleSubmit = async () => {
        setFormError('');
        if (!name.trim()) {
            setFormError('Please enter the pet’s name.');
            return;
        }
        if (!breed.trim()) {
            setFormError('Please enter a breed.');
            return;
        }
        if (!city.trim()) {
            setFormError('Please enter a city / location.');
            return;
        }
        if (files.length < 1) {
            setFormError('Please add at least one photo (uploads to Cloudinary).');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setFormError('You must be signed in to add a pet.');
            return;
        }

        const age = parseInt(ageYears, 10);
        if (Number.isNaN(age) || age < 0) {
            setFormError('Please enter a valid age in years.');
            return;
        }

        setSubmitting(true);
        try {
            const imageUrls = [];
            for (const { file } of files) {
                imageUrls.push(await uploadToCloudinary(file));
            }

            await axios.post(
                API_ADD,
                {
                    name: name.trim(),
                    pet_type: petType,
                    breed: breed.trim(),
                    gender,
                    age,
                    city: city.trim(),
                    vaccination_status: VACC_DB[vaccination] || VACC_DB.partial,
                    description: description.trim() || `${name.trim()} is looking for a home.`,
                    images: imageUrls,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            setFormError(
                err.response?.data?.error ||
                    err.message ||
                    'Could not save the pet. Check the form and try again.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-[#EDEFD7] p-10 rounded-sm border-2 border-black text-center max-w-sm">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-3xl">✔</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#C2185B] mb-2">Pet successfully put up for adoption!</h3>
                    <p className="text-sm mb-6">Hold tight while we receive adoption applications</p>
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-[#C2185B] text-white px-10 py-2 font-bold border-2 border-black"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
            <div className="bg-[#EDEFD7] w-full max-w-4xl rounded-sm border-2 border-black m-4 relative">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-4 text-2xl font-bold text-gray-700 hover:text-red-600 z-10"
                    aria-label="Close"
                >
                    ×
                </button>
                <div className="bg-[#DED9C4] p-4 text-center text-2xl font-bold border-b-2 border-black">
                    Put up for adoption
                </div>

                <div className="p-8 grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold">Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Please name the pet..."
                                className="w-full border border-black p-2 bg-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold">Animal Type <span className="text-red-500">*</span></label>
                            <select
                                value={petType}
                                onChange={(e) => setPetType(e.target.value)}
                                className="w-full border border-black p-2 bg-white"
                            >
                                <option>Monkey</option>
                                <option>Cat</option>
                                <option>Dog</option>
                                <option>Duck</option>
                                <option>Bird</option>
                                <option>Rabbit</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold">Gender <span className="text-red-500">*</span></label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="w-full border border-black p-2 bg-white"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold">City <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="e.g. Lahore"
                                className="w-full border border-black p-2 bg-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold">Photos <span className="text-red-500">*</span></label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => {
                                    addFiles(e.target.files);
                                    e.target.value = '';
                                }}
                            />
                            <div
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
                                }}
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                                className="border-2 border-dashed border-black min-h-40 flex flex-col items-center justify-center bg-[#DED9C4] cursor-pointer hover:bg-gray-200 transition p-3"
                            >
                                <span className="text-3xl text-green-700">⤒</span>
                                <p className="text-[10px] mt-2 text-center">
                                    Click or drop images here (JPG, PNG). At least one required.
                                </p>
                            </div>
                            {files.length > 0 && (
                                <ul className="mt-2 flex flex-wrap gap-2">
                                    {files.map(({ id, file }) => (
                                        <li key={id} className="relative w-16 h-16 border border-black">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFile(id);
                                                }}
                                                className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full leading-none"
                                            >
                                                ×
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold">Vaccination <span className="text-red-500">*</span></label>
                            <div className="flex flex-col gap-2 text-sm mt-1">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="vacc"
                                        checked={vaccination === 'full'}
                                        onChange={() => setVaccination('full')}
                                    />
                                    Fully vaccinated
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="vacc"
                                        checked={vaccination === 'partial'}
                                        onChange={() => setVaccination('partial')}
                                    />
                                    Partially vaccinated
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="vacc"
                                        checked={vaccination === 'none'}
                                        onChange={() => setVaccination('none')}
                                    />
                                    Not vaccinated
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold">Description <span className="text-red-500">*</span></label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Please describe the pet..."
                                className="w-full h-24 border border-black p-2 bg-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold">Breed <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={breed}
                                onChange={(e) => setBreed(e.target.value)}
                                placeholder="Breed"
                                className="w-full border border-black p-2 bg-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold">Age (years) <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                min={0}
                                max={30}
                                value={ageYears}
                                onChange={(e) => setAgeYears(e.target.value)}
                                className="w-full border border-black p-2 bg-white"
                            />
                        </div>
                        {formError && (
                            <p className="text-sm text-red-600 font-medium">{formError}</p>
                        )}
                        <div className="flex justify-end pt-2">
                            <button
                                type="button"
                                disabled={submitting}
                                onClick={handleSubmit}
                                className="bg-[#C2185B] text-white px-8 py-2 font-bold border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all disabled:opacity-50"
                            >
                                {submitting ? 'Uploading…' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

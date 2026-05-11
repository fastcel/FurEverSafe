import React, { useState, useRef, useCallback } from 'react';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';

const EditPetModal = ({ pet, onClose, onSave }) => {
    if (!pet) return null;

    const [formData, setFormData] = useState({
        name: pet.name || '',
        type: pet.type || 'Cat',
        breed: pet.breed || '',
        ageYears: pet.ageYears || '0',
        ageMonths: pet.ageMonths || '0',
        status: pet.status || 'Partially Vaccinated',
        description: pet.description || `${pet.name} is a gentle, playful companion.`,
    });
    const [newFiles, setNewFiles] = useState([]);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const fileInputRef = useRef(null);

    const addFiles = useCallback((fileList) => {
        const next = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'));
        if (!next.length) return;
        setNewFiles((prev) => {
            const merged = [...prev];
            for (const f of next) {
                merged.push({
                    id: `${f.name}-${f.size}-${merged.length}-${Date.now()}`,
                    file: f,
                    previewUrl: URL.createObjectURL(f),
                });
            }
            return merged;
        });
    }, []);

    const removeNewFile = (id) => {
        setNewFiles((prev) => {
            const row = prev.find((x) => x.id === id);
            if (row?.previewUrl) URL.revokeObjectURL(row.previewUrl);
            return prev.filter((x) => x.id !== id);
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addFiles(e.dataTransfer.files);
    };

    const handleSave = async () => {
        if (!onSave) {
            console.log('Saving updated pet data:', formData);
            onClose();
            return;
        }
        setSaving(true);
        setSaveError('');
        try {
            let extra;
            if (newFiles.length > 0) {
                const uploaded = [];
                for (const { file } of newFiles) {
                    uploaded.push(await uploadToCloudinary(file));
                }
                const existing = Array.isArray(pet.imageUrls) && pet.imageUrls.length
                    ? [...pet.imageUrls]
                    : pet.image
                      ? [pet.image]
                      : [];
                extra = { images: [...existing, ...uploaded] };
            }
            await onSave(formData, extra);
            onClose();
        } catch (err) {
            console.error(err);
            setSaveError(err.response?.data?.error || err.message || 'Save failed.');
        } finally {
            setSaving(false);
        }
    };

    const existingUrls = Array.isArray(pet.imageUrls) && pet.imageUrls.length
        ? pet.imageUrls
        : pet.image
          ? [pet.image]
          : [];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-[#EDEFD7] w-full max-w-5xl rounded-sm border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">

                <button type="button" onClick={onClose} className="absolute top-4 right-6 text-3xl font-bold hover:text-red-600 transition-colors">×</button>

                <div className="bg-[#DED9C4] p-5 text-center border-b-2 border-black">
                    <h2 className="text-3xl font-bold text-[#6A1B9A]">Edit Pet Details</h2>
                </div>

                <div className="p-10 grid grid-cols-2 gap-x-12 gap-y-6">

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold mb-1">Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full border-2 border-black p-2.5 bg-white text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1">Animal Type <span className="text-red-500">*</span></label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="w-full border-2 border-black p-2.5 bg-white text-sm appearance-none cursor-pointer"
                            >
                                <option>Monkey</option>
                                <option>Cat</option>
                                <option>Dog</option>
                                <option>Duck</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1">Photos</label>
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
                                <span className="text-4xl text-green-700">⤒</span>
                                <p className="text-[11px] mt-3 text-center text-gray-700 leading-relaxed px-4">
                                    Add more images (JPG, PNG). New images are appended when you save.
                                </p>
                            </div>
                            {existingUrls.length > 0 && (
                                <div className="mt-2">
                                    <p className="text-xs font-bold text-gray-600 mb-1">Current</p>
                                    <ul className="flex flex-wrap gap-2">
                                        {existingUrls.map((url) => (
                                            <li key={url} className="w-14 h-14 border border-black">
                                                <img src={url} alt="" className="w-full h-full object-cover" />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {newFiles.length > 0 && (
                                <div className="mt-2">
                                    <p className="text-xs font-bold text-gray-600 mb-1">New</p>
                                    <ul className="flex flex-wrap gap-2">
                                        {newFiles.map(({ id, previewUrl }) => (
                                            <li key={id} className="relative w-14 h-14 border border-black">
                                                <img src={previewUrl} alt="" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeNewFile(id);
                                                    }}
                                                    className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full leading-none"
                                                >
                                                    ×
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold mb-1.5">Adoption Status <span className="text-red-500">*</span></label>
                            <div className="flex gap-4 text-[11px]">
                                {['Fully Vaccinated', 'Partially Vaccinated', 'Not Vaccinated'].map((status) => (
                                    <label key={status} className="flex items-center gap-1.5 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            value={status}
                                            checked={formData.status === status}
                                            onChange={handleInputChange}
                                            className="accent-[#C2185B]"
                                        />
                                        {status}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1">Description <span className="text-red-500">*</span></label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full h-28 border-2 border-black p-3 bg-white text-sm resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1">Breed <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="breed"
                                value={formData.breed}
                                onChange={handleInputChange}
                                className="w-full border-2 border-black p-2.5 bg-white text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1">Age <span className="text-red-500">*</span></label>
                            <div className="flex gap-4">
                                {['Years', 'Months'].map((unit) => (
                                    <select
                                        key={unit}
                                        name={`age${unit}`}
                                        value={formData[`age${unit}`]}
                                        onChange={handleInputChange}
                                        className="flex-1 border-2 border-black p-2 bg-white text-sm"
                                    >
                                        {Array.from({ length: 13 }, (_, i) => (
                                            <option key={i} value={i}>{i} {unit}</option>
                                        ))}
                                    </select>
                                ))}
                            </div>
                        </div>
                        {saveError && <p className="text-sm text-red-600 font-medium">{saveError}</p>}
                    </div>
                </div>

                <div className="p-8 border-t-2 border-black flex justify-end gap-6">
                    <button type="button" onClick={onClose} className="bg-white px-10 py-2.5 font-bold border-2 border-black rounded-sm active:translate-y-0.5 transition-all">
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={saving}
                        onClick={handleSave}
                        className="bg-[#C2185B] text-white px-10 py-2.5 font-bold border-2 border-black rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 transition-all disabled:opacity-60"
                    >
                        {saving ? 'Saving…' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPetModal;

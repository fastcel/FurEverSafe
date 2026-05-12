import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import PetCard from '../../components/PetCard';
import PetFormModal from '../../components/PetFormModal';
import EditPetModal from '../../components/EditPetModal';

const API_BASE = 'http://localhost:5000/api/pets';
const PLACEHOLDER_IMAGE = 'https://placecats.com/300/200';

function normalizeImages(images) {
    if (!images) return [];
    if (Array.isArray(images)) return images.filter(Boolean);
    return [];
}

function vaccinationLabel(raw) {
    if (!raw) return 'Partially Vaccinated';
    const s = String(raw).toLowerCase().replace(/\s+/g, '_');
    if (s.includes('full')) return 'Fully Vaccinated';
    if (s.includes('not')) return 'Not Vaccinated';
    if (s.includes('partial')) return 'Partially Vaccinated';
    return String(raw);
}

function vaccinationLabelToDb(label) {
    const map = {
        'Fully Vaccinated': 'fully_vaccinated',
        'Partially Vaccinated': 'partially_vaccinated',
        'Not Vaccinated': 'not_vaccinated',
    };
    return map[label] || 'partially_vaccinated';
}

function mapRowToPet(row) {
    const imgs = normalizeImages(row.images);
    const image = imgs[0] || PLACEHOLDER_IMAGE;
    const n = row.age;
    const ageStr =
        n != null && n !== ''
            ? `${Number(n)} ${Number(n) === 1 ? 'year' : 'years'}`
            : '—';
    const petType = (row.pet_type || 'Pet').trim() || 'Pet';
    const ageYears = String(row.age != null && row.age !== '' ? Number(row.age) : 0);
    return {
        pet_id: row.pet_id,
        name: row.name,
        age: ageStr,
        gender: (row.gender || 'male').toLowerCase(),
        breed: row.breed || '—',
        location: row.city || '—',
        image,
        imageUrls: imgs,
        petType,
        type: petType,
        status: vaccinationLabel(row.vaccination_status),
        description: row.description || '',
        ageYears,
        ageMonths: '0',
        created_at: row.created_at,
    };
}


export default function NGODashboard() {
    const [showForm, setShowForm] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [editingPet, setEditingPet] = useState(null);

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState(null);

    const loadPets = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('You need to be signed in as an NGO to view your pets.');
            setRows([]);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get(`${API_BASE}/ngo`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const list = res.data?.pets;
            setRows(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to load pets from the server.');
            setRows([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPets();
    }, [loadPets]);

    const typeOptions = useMemo(() => {
        const set = new Set();
        for (const r of rows) {
            const t = (r.pet_type || 'Pet').trim() || 'Pet';
            set.add(t);
        }
        return [...set].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    }, [rows]);

    const filteredSortedRows = useMemo(() => {
        let list = rows;
        const q = searchQuery.trim().toLowerCase();
        if (q) {
            list = list.filter((row) => {
                const hay = `${row.name || ''} ${row.breed || ''} ${row.city || ''}`.toLowerCase();
                return hay.includes(q);
            });
        }
        if (typeFilter) {
            list = list.filter(
                (row) => (row.pet_type || '').toLowerCase() === typeFilter.toLowerCase()
            );
        }
        return list;
    }, [rows, searchQuery, typeFilter]);

    const groupedPets = useMemo(() => {
        const map = new Map();
        for (const row of filteredSortedRows) {
            const pet = mapRowToPet(row);
            const key = pet.petType;
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(pet);
        }
        return [...map.entries()].sort((a, b) =>
            a[0].localeCompare(b[0], undefined, { sensitivity: 'base' })
        );
    }, [filteredSortedRows]);

    const handleSavePet = async (formData, extra) => {
        if (!editingPet?.pet_id) return;
        const token = localStorage.getItem('token');
        const ageWhole = parseInt(formData.ageYears, 10) || 0;
        const body = {
            name: formData.name,
            breed: formData.breed,
            age: ageWhole,
            vaccination_status: vaccinationLabelToDb(formData.status),
            description: formData.description,
        };
        if (extra?.images?.length) {
            body.images = extra.images;
        }
        await axios.patch(`${API_BASE}/ngo/${editingPet.pet_id}`, body, {
            headers: { Authorization: `Bearer ${token}` },
        });
        await loadPets();
    };

    const closeForm = () => {
        setShowForm(false);
        loadPets();
    };

    return (
        <Layout>
            <div className="w-full min-h-screen p-8 bg-[#F5F1E3]">
                {showForm && <PetFormModal onClose={closeForm} />}

                {editingPet && (
                    <EditPetModal
                        key={editingPet.pet_id}
                        pet={editingPet}
                        onClose={() => setEditingPet(null)}
                        onSave={handleSavePet}
                    />
                )}

                <div className="flex items-center gap-4 mb-8 w-full relative">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Search pets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-2 pl-10 rounded-sm border border-gray-300 bg-white focus:outline-none"
                        />
                    </div>


                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => {
                                setShowFilter(!showFilter);
                            }}
                            className="bg-[#C2185B] text-white px-8 py-1 rounded-sm font-bold border-2 border-black"
                        >
                            Filter
                        </button>
                        {showFilter && (
                            <div className="absolute right-0 mt-2 w-72 bg-[#EDEFD7] border-2 border-black z-30 p-4 shadow-lg">
                                <div className="font-bold border-b border-black pb-2 mb-3">Animal type</div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setTypeFilter(null);
                                            setShowFilter(false);
                                        }}
                                        className={`text-left text-sm py-2 px-3 border rounded-sm ${!typeFilter ? 'bg-[#C2185B] text-white border-black' : 'bg-white border-gray-300'}`}
                                    >
                                        All types
                                    </button>
                                    {typeOptions.map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => {
                                                setTypeFilter(t);
                                                setShowFilter(false);
                                            }}
                                            className={`text-left text-sm py-2 px-3 border rounded-sm ${typeFilter === t ? 'bg-[#C2185B] text-white border-black' : 'bg-white border-gray-300'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-12">
                    {loading ? (
                        <div className="text-center py-20 font-bold text-xl animate-pulse">
                            Loading your pets…
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 text-red-600 font-bold">{error}</div>
                    ) : groupedPets.length === 0 ? (
                        <div className="text-center py-20 text-gray-500 italic">
                            No pets yet. Use the + button to add a pet for adoption.
                        </div>
                    ) : (
                        groupedPets.map(([typeName, pets], idx) => (
                            <section
                                key={typeName}
                                className={idx > 0 ? 'pt-6 border-t border-gray-300' : ''}
                            >
                                <h2 className="text-3xl font-black mb-8 text-[#3A1D44] capitalize">{typeName}</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {pets.map((pet) => (
                                        <PetCard
                                        key={pet.pet_id}
                                        pet_id={pet.pet_id}
                                        name={pet.name}
                                        age={pet.age}
                                        gender={pet.gender}
                                        breed={pet.breed}
                                        city={pet.location} // Ensure this maps to 'city' prop in PetCard
                                        image={pet.image}
                                        isAdmin={true}
                                        onEdit={() => setEditingPet(pet)}
                                        onClick={() => setEditingPet(pet)} // Clicking the card opens the edit modal
                                        />
                                    ))}
                                    </div>
                            </section>
                        ))
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    title="Add New Pet"
                    className="fixed bottom-10 right-10 w-16 h-16 bg-[#C2185B] text-white rounded-full text-4xl flex items-center justify-center border-4 border-white shadow-lg hover:scale-110 active:scale-95 transition-transform z-40"
                >
                    +
                </button>
            </div>
        </Layout>
    );
}

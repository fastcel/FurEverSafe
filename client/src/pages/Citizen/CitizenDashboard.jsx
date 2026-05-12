import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import PetCard from "../../components/PetCard";
import PetModal from "../../components/PetModal";
import SortDropdown from "../../components/SortDropdown";
import FilterModal from "../../components/DashboardFilterModal";

export default function CitizenDashboard() {
  const [selectedPet, setSelectedPet] = useState(null);
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    city: "",
    gender: "",
    age: "",
    uploadDate: "",
  });
  const [filterSections, setFilterSections] = useState([
    {
      title: "Category",
      tags: [
        "Cat",
        "Dog",
        "Bird",
        "Rabbit",
        "Horse",
        "Cow",
        "Chicken",
        "Monkey",
      ],
      selected: "",
    },

    {
      title: "Upload date",
      tags: ["Today", "Last Week", "Last Month", "Last Year"],
      selected: "",
    },

    {
      title: "Gender",
      tags: ["Male", "Female"],
      selected: "",
    },

    {
      title: "Age",
      tags: ["Baby", "Young", "Adult", "Senior"],
      selected: "",
    },

    {
      title: "Location",
      tags: ["Lahore", "Karachi", "Islamabad"],
      selected: "",
    },
  ]);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [appliedPets, setAppliedPets] = useState([]);
  const appliedPetSet = new Set(appliedPets.map((p) => p.pet_id));

  useEffect(() => {
    const fetchAppliedPets = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/pets/user/applied",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log(res.data);
        setAppliedPets(res.data.pets || []);
      } catch (err) {
        console.error("Failed to fetch applied pets:", err);
      }
    };

    fetchAppliedPets();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);

        const params = {
          search: debouncedSearch,
          sort,
          ...filters,
        };

        // remove empty fields
        Object.keys(params).forEach((key) => {
          if (!params[key]) {
            delete params[key];
          }
        });

        console.log("QUERY PARAMS:", params);

        const response = await axios.get("http://localhost:5000/api/pets", {
          params,
        });

        console.log("GET /api/pets response:", response.data);

        setPets(response.data);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load pets.");
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [debouncedSearch, sort, filters]);

  const groupedPets = pets.reduce((groups, pet) => {
    const type = pet.pet_type || pet.animalType || "Other";
    if (!groups[type]) groups[type] = [];
    groups[type].push(pet);
    return groups;
  }, {});

  const animalTypes = Object.keys(groupedPets);

  return (
    <Layout>
      {/* Background color for the main content area to match Figma's soft cream/beige */}
      <div className="w-full min-h-screen p-8 bg-[#F5F1E3]">
        {selectedPet && (
          <PetModal pet={selectedPet} onClose={() => setSelectedPet(null)} />
        )}

        {/* --- HEADER SECTION --- */}
        {/* Added flex-nowrap and specific gap to match Figma's alignment */}
        <div className="flex items-center justify-between gap-6 mb-10 w-full">
          {/* Search Bar: Reduced height and rounded borders like Figma */}
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-2 pl-12 pr-4 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-sm text-lg"
            />
          </div>

          {/* Buttons: Added shadow, rounded corners, and specific Figma Pink color */}
          <div className="flex gap-4">
            <div className="relative">
              <button
                onClick={() => {
                  setShowSort(!showSort);
                  setShowFilter(false);
                }}
                className="bg-[#C2185B] text-white px-6 py-2 rounded-md font-bold text-sm border-b-4 border-black hover:bg-[#A3144D] active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2"
              >
                ↕ Sort
              </button>
              {showSort && (
                <div className="absolute right-0 mt-2 z-50">
                  <SortDropdown
                    selectedSort={sort}
                    onClose={() => setShowSort(false)}
                    onSelect={(value) => {
                      setSort(value);
                      setShowSort(false);
                    }}
                  />
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setShowFilter(!showFilter);
                  setShowSort(false);
                }}
                className="bg-[#C2185B] text-white px-6 py-2 rounded-md font-bold text-sm border-b-4 border-black hover:bg-[#A3144D] active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2"
              >
                🔍 Filter
              </button>
              {showFilter && (
                <div className="absolute right-0 mt-2 z-50">
                  <FilterModal
                    sections={filterSections}
                    setSections={setFilterSections}
                    onClose={() => setShowFilter(false)}
                    onApply={(newFilters) => {
                      setFilters(newFilters);
                      setShowFilter(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- PETS CONTENT --- */}
        <div className="w-full">
          {loading ? (
            <div className="text-center py-20 font-bold text-xl text-pink-700 animate-pulse">
              Fetching your new friends...
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-600 font-bold">
              {error}
            </div>
          ) : (
            <>
              {animalTypes.length > 0 ? (
                animalTypes.map((type) => (
                  <section key={type} className="mb-14">
                    {/* Header: Dark purple/black color and proper margin */}
                    <h2 className="text-3xl font-black mb-8 text-[#3A1D44] capitalize">
                      {type}s
                    </h2>

                    {/* Grid Layout: Using 4 columns for large screens to match Figma */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {groupedPets[type].map((pet) => (
                        <PetCard
                          key={pet.pet_id || pet.id}
                          {...pet}
                          image={pet.images?.[0] || ""}
                          onClick={() => {
                            if (appliedPetSet.has(pet.pet_id)) return;
                            setSelectedPet(pet);
                          }}
                          disabled={appliedPetSet.has(pet.pet_id)}
                          isApplied={appliedPetSet.has(pet.pet_id)}
                        />
                      ))}
                    </div>
                  </section>
                ))
              ) : (
                <div className="text-center py-20 text-gray-500 italic text-xl border-2 border-dashed border-gray-300 rounded-xl">
                  No furry friends currently available.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

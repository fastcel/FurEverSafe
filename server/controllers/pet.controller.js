const petService = require("../services/pet.service");

/* =========================
   GET PET LIST (Dashboard)
========================= */
const getAllPets = async (req, res) => {
  try {
    const pets = await petService.getAllPets(req.query);
    res.json(pets);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch pets" });
  }
};

/* =========================
   GET SINGLE PET
========================= */
const getPetById = async (req, res) => {
  try {
    const pet = await petService.getPetById(req.params.id);

    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    res.json(pet);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch pet" });
  }
};

const addPet = async (req, res) => {
  try {
    const result = await petService.addPet(req.body, req.user.id);

    return res.status(201).json({
      message: "Pet added successfully",
      pet: result,
    });

  } catch (err) {
    console.log("🔥 ADD PET ERROR:", err.message);

    return res.status(400).json({
      error: err.message || "Failed to add pet",
    });
  }
};

const getNgoPets = async (req, res) => {
  try {
    const pets = await petService.getNgoPets(req.user.id);

    return res.status(200).json({
      message: "NGO pets fetched successfully",
      pets,
    });

  } catch (err) {
    console.log("🔥 NGO PETS ERROR:", err.message);

    return res.status(500).json({
      error: "Failed to fetch NGO pets",
    });
  }
};

const updatePetPatch = async (req, res) => {
  try {
    const result = await petService.updatePetPatch(
      req.user.id,
      req.params.id,
      req.body
    );

    return res.status(200).json({
      message: "Pet updated successfully",
      pet: result,
    });

  } catch (err) {
    console.log("🔥 UPDATE PET ERROR:", err.message);

    return res.status(400).json({
      error: err.message || "Failed to update pet",
    });
  }
};

module.exports = {
  getAllPets,
  getPetById,
  addPet,
  getNgoPets,
  updatePetPatch,
};
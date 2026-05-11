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

module.exports = {
  getAllPets,
  getPetById,
};
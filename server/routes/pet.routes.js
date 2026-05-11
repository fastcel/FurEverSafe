const express = require("express");
const router = express.Router();

const petController = require("../controllers/pet.controller");

router.get("/", petController.getAllPets); // ✅ FIXED
router.get("/:id", petController.getPetById);

module.exports = router;    
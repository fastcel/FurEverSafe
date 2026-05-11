const express = require("express");
const router = express.Router();

const petController = require("../controllers/pet.controller");
const { authenticate, authorizeRoles } = require("../middlewares/auth.middleware");

router.get("/", petController.getAllPets);
router.get("/:id", petController.getPetById);
router.post("/ngo/add", authenticate, authorizeRoles("ngo"), petController.addPet);
router.get(
  "/ngo",
  authenticate,
  authorizeRoles("ngo"),
  petController.getNgoPets
);
router.patch(
  "/ngo/:id",
  authenticate,
  authorizeRoles("ngo"),
  petController.updatePetPatch
);

module.exports = router;    
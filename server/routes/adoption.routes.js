const express = require("express");
const router = express.Router();
const {
  authenticate,
  authorizeRoles,
} = require("../middlewares/auth.middleware");
const adoptionController = require("../controllers/adoption.controller");

router.post("/apply", adoptionController.submitApplication);
router.get("/my-applications", adoptionController.getUserApplications);
router.get(
  "/ngo/pets",
  authenticate,
  authorizeRoles("ngo"),
  adoptionController.getNgoPetsWithApplications
);

router.get(
  "/ngo/pets/:petId/applications",
  authenticate,
  authorizeRoles("ngo"),
  adoptionController.getApplicationsForPet
);

router.get(
  "/ngo/applications/:applicationId",
  authenticate,
  authorizeRoles("ngo"),
  adoptionController.getApplicationDetails
);
router.patch(
  "/ngo/applications/:id/approve",
  authenticate,
  authorizeRoles("ngo"),
  adoptionController.approveApplication
);

router.patch(
  "/ngo/applications/:id/reject",
  authenticate,
  authorizeRoles("ngo"),
  adoptionController.rejectApplication
);

module.exports = router;
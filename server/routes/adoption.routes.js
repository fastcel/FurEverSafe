const express = require("express");
const router = express.Router();

const adoptionController = require("../controllers/adoption.controller");

router.post("/apply", adoptionController.submitApplication);
router.get("/my-applications", adoptionController.getUserApplications);


module.exports = router;
const express = require("express");
const router = express.Router();

const adoptionController = require("../controllers/adoption.controller");

router.post("/apply", adoptionController.submitApplication);

module.exports = router;
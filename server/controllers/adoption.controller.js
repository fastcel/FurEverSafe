const adoptionService = require("../services/adoption.service");

const submitApplication = async (req, res) => {
  try {
    const result = await adoptionService.submitApplication(req.body,req.user.id);

    return res.status(201).json({
      message: "Application submitted successfully",
      application: result,
    });

  } catch (err) {
    console.log("🔥 CONTROLLER ERROR:", err.message);

    return res.status(400).json({
      error: err.message || "Failed to submit application",
    });
  }
};


const getApprovedApplicationForPet = async (req, res) => {
  try {
    const data = await adoptionService.getApprovedApplicationForPet(
      req.user.id,
      req.params.petId
    );
    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getUserApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tab } = req.query;

    const data = await adoptionService.getUserApplications(
      userId,
      tab
    );

    return res.status(200).json({
      message: "Applications fetched successfully",
      applications: data,
    });

  } catch (err) {
    console.log("🔥 USER APPLICATIONS ERROR:", err.message);

    return res.status(500).json({
      error: "Failed to fetch applications",
    });
  }
};

/* ======================================================
   NGO - GET PETS WITH APPLICATION COUNTS
====================================================== */
const getNgoPetsWithApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = await adoptionService.getNgoPetsWithApplications(userId);

    return res.status(200).json({
      message: "NGO pets fetched successfully",
      pets: data,
    });

  } catch (err) {
    console.log("🔥 NGO PET APPLICATIONS ERROR:", err.message);

    return res.status(500).json({
      error: err.message || "Failed to fetch pets",
    });
  }
};

/* ======================================================
   NGO - GET APPLICATIONS FOR ONE PET
====================================================== */
const getApplicationsForPet = async (req, res) => {
  try {
    const userId = req.user.id;
    const petId = req.params.petId;

    const data = await adoptionService.getApplicationsForPet(
      userId,
      petId
    );

    return res.status(200).json({
      message: "Applications fetched successfully",
      applications: data,
    });

  } catch (err) {
    console.log("🔥 PET APPLICATION LIST ERROR:", err.message);

    return res.status(500).json({
      error: err.message || "Failed to fetch applications",
    });
  }
};

/* ======================================================
   NGO - GET SINGLE APPLICATION DETAILS
====================================================== */
const getApplicationDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const applicationId = req.params.applicationId;

    const data = await adoptionService.getApplicationDetails(
      userId,
      applicationId
    );

    return res.status(200).json({
      message: "Application details fetched successfully",
      application: data,
    });

  } catch (err) {
    console.log("🔥 APPLICATION DETAILS ERROR:", err.message);

    return res.status(500).json({
      error: err.message || "Failed to fetch application details",
    });
  }
};

/* ======================================================
   NGO APPROVE APPLICATION
====================================================== */
const approveApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const applicationId = req.params.id;

    const result = await adoptionService.approveApplication(
      userId,
      applicationId
    );

    return res.status(200).json({
      message: "Application approved successfully",
      data: result,
    });

  } catch (err) {
    console.log("🔥 APPROVE ERROR:", err.message);

    return res.status(400).json({
      error: err.message || "Failed to approve application",
    });
  }
};

/* ======================================================
   NGO REJECT APPLICATION
====================================================== */
const rejectApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const applicationId = req.params.id;

    const result = await adoptionService.rejectApplication(
      userId,
      applicationId
    );

    return res.status(200).json({
      message: "Application rejected successfully",
      data: result,
    });

  } catch (err) {
    console.log("🔥 REJECT ERROR:", err.message);

    return res.status(400).json({
      error: err.message || "Failed to reject application",
    });
  }
};

module.exports = {
  submitApplication,
  getUserApplications,
  getNgoPetsWithApplications,
  getApplicationsForPet,
  getApplicationDetails,
  approveApplication,
  rejectApplication,
  getApprovedApplicationForPet,
};
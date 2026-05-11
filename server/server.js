require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth"); 
const petRoutes = require("./routes/pet.routes");
const adoptionRoutes = require("./routes/adoption.routes");
const adminUserRoutes = require("./routes/admin.users.routes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/pets", petRoutes);
app.use(
  "/api/adoption",
  adoptionRoutes
);
app.use("/api/admin", adminUserRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
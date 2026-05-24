// 1. DYNAMIC ENVIRONMENT LOADING (Fixes the environment crash)
const isTestEnv = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'test ' || process.env.JEST_WORKER_ID !== undefined;
const envPath = isTestEnv ? './.env.test' : './API_KEY.env';
require("dotenv").config({ path: envPath });

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const FormData = require("form-data");
const db = require("./db");

// --- 1. IMPORT ALL SHARED ROUTES ---
const authRoutes = require("./routes/auth");
const alertRoutes = require("./routes/alerts");
const userRoutes = require("./routes/users");
const notificationRoutes = require("./routes/notifications");
const courseRoutes = require("./routes/courses");
const moduleRoutes = require("./routes/modules");
const lessonRoutes = require("./routes/lessons");
const quizRoutes = require("./routes/quizzes");
const quizQuestionRoutes = require("./routes/quizQuestions");
const quizAttemptRoutes = require("./routes/quizAttempts");
const iotRoutes = require("./routes/iot"); // <-- Emily's IoT route restored!

const app = express();
const PORT = 3000;

app.use(cors());
// limit: "50mb" is required so your large AR images don't crash the server
app.use(express.json({ limit: "50mb" })); 

const PLANTNET_API_KEY = (process.env.PLANTNET_API_KEY || "").trim();
const INAT_API_TOKEN   = (process.env.INAT_API_TOKEN || "").trim();

// =============================================================================
// STANDARD BACKEND ROUTES
// =============================================================================
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// 2. FIXED ROUTE PATH (Fixes the 404 errors)
app.use("/auth", authRoutes); 

app.use("/alerts", alertRoutes);
app.use("/users", userRoutes);
app.use("/notifications", notificationRoutes);
app.use("/courses", courseRoutes);
app.use("/modules", moduleRoutes);
app.use("/lessons", lessonRoutes);
app.use("/quizzes", quizRoutes);

// ⚠️ ALIAS ROUTES: These support BOTH Emily's website (- dash) and your mobile app (camelCase)!
app.use("/quiz-questions", quizQuestionRoutes);
app.use("/quizQuestions", quizQuestionRoutes);
app.use("/quiz-attempts", quizAttemptRoutes);
app.use("/quizAttempts", quizAttemptRoutes);

// Restore Emily's IoT Route
app.use("/api/iot", iotRoutes);


// =============================================================================
// IDENTIFICATION LOGIC - SUPER BACKUP
// =============================================================================

// 1️⃣ PlantNet — identify plants
async function detectPlant(buffer) {
  if (!PLANTNET_API_KEY) return null;

  const form = new FormData();
  form.append("images", buffer, { filename: "image.jpg", contentType: "image/jpeg" });
  form.append("organs", "auto");

  const headers = form.getHeaders();
  headers["Content-Length"] = form.getLengthSync();

  const response = await axios.post(
    `https://my-api.plantnet.org/v2/identify/all?include-related-images=false&api-key=${PLANTNET_API_KEY}`,
    form,
    { headers: headers, maxBodyLength: Infinity, timeout: 12000 } 
  );

  const results = response.data.results || [];
  const best    = results[0];

  if (!best || best.score < 0.2) return null;

  const sciName     = best.species?.scientificNameWithoutAuthor || best.species?.scientificName || "Unknown Plant";
  const commonNames = best.species?.commonNames || [];

  return {
    type:            "plant",
    species_name:    commonNames[0] || sciName,
    scientific_name: commonNames.length > 0 ? sciName : null,
    description:     "Identified using PlantNet botanical AI.",
    status:          "Detected",
    confidence:      best.score,
  };
}

// 2️⃣ iNaturalist Vision — SUPER BACKUP (Catches Animals AND Plants)
const ANIMAL_ICONIC_TAXA = new Set([
  "Mammalia", "Aves", "Reptilia", "Amphibia",
  "Actinopterygii", "Insecta", "Arachnida", "Mollusca",
  "Animalia",
]);

async function detectINaturalist(buffer) {
  if (!INAT_API_TOKEN) return null;

  const form = new FormData();
  form.append("image", buffer, { filename: "image.jpg", contentType: "image/jpeg" });

  const headers = form.getHeaders();
  headers["Content-Length"] = form.getLengthSync();
  headers["Authorization"] = `Bearer ${INAT_API_TOKEN}`;

  const response = await axios.post(
    "https://api.inaturalist.org/v1/computervision/score_image",
    form,
    { headers: headers, maxBodyLength: Infinity, timeout: 10000 }
  );

  const results = response.data.results || [];
  const best = results[0];
  
  if (!best || best.combined_score < 10) return null; 

  const taxon      = best.taxon || {};
  const commonName = taxon.preferred_common_name || taxon.name || "Species";
  const sciName    = taxon.name || null;
  const iconic     = taxon.iconic_taxon_name || "Unknown";

  const isAnimal = ANIMAL_ICONIC_TAXA.has(iconic);

  return {
    type:            isAnimal ? "animal" : "plant",
    species_name:    commonName,
    scientific_name: sciName !== commonName ? sciName : null,
    description:     isAnimal 
                        ? "Wildlife identified using iNaturalist Vision AI." 
                        : "Plant species identified using iNaturalist Vision AI.",
    status:          "Detected",
    confidence:      best.combined_score / 100,
    animal_class:    iconic,
  };
}

// 3️⃣ Main Detection Route
app.post("/detect", async (req, res) => {
  const { image } = req.body;
  if (!image) return res.json({ results: [] });

  let buffer;
  try {
    buffer = Buffer.from(image, "base64");
    console.log(`\n[Detect] Image — ${(buffer.length / 1024).toFixed(1)} KB`);
  } catch (e) {
    return res.json({ results: [] });
  }

  // Step 1 — Try PlantNet
  try {
    const plant = await detectPlant(buffer);
    if (plant) {
      console.log("[✓] PlantNet found:", plant.species_name);
      return res.json({ results: [plant] });
    }
  } catch (err) {
    console.log("[PlantNet] Timeout/Error — falling back to iNaturalist");
  }

  // Step 2 — iNaturalist catches EVERYTHING ELSE (Animals + Missed Plants)
  try {
    const species = await detectINaturalist(buffer);
    if (species) {
      console.log(`[✓] iNaturalist found (${species.type}):`, species.species_name);
      return res.json({ results: [species] });
    }
  } catch (err) {
    console.log("[iNaturalist] Error:", err.message);
  }

  // Step 3 — Nothing detected
  console.log("[–] Nothing detected");
  return res.json({ results: [] });
});

// =============================================================================
// START SERVER
// =============================================================================

// 3. PREVENT PORT LOCKING (Only start the live server if we aren't testing)
if (!isTestEnv) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log("─────────────────────────────────────");
    console.log(`  SarakWay backend on port ${PORT}`);
    console.log(`  PlantNet key:   ${PLANTNET_API_KEY ? "✓ loaded" : "✗ MISSING"}`);
    console.log(`  iNaturalist:    ${INAT_API_TOKEN   ? "✓ loaded" : "✗ MISSING"}`);
    console.log("─────────────────────────────────────");
  });
}

// Ensure the app is exported so Supertest can use it
module.exports = app;
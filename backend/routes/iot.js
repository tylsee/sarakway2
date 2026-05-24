const express = require("express");
const router = express.Router();
const axios = require("axios");
const db = require("../db");

const BLYNK_AUTH_TOKEN = "cztd7LVnqg0wHQE1lbmHBwpyMMY6bP82";
const BLYNK_API_URL = `https://sgp1.blynk.cloud/external/api`;

const monitorHardware = async () => {
    try {
        const [resPIR, resDist] = await Promise.all([
            axios.get(`${BLYNK_API_URL}/get?token=${BLYNK_AUTH_TOKEN}&V3`),
            axios.get(`${BLYNK_API_URL}/get?token=${BLYNK_AUTH_TOKEN}&V1`)
        ]);

        const pirValue = resPIR.data;
        const distValue = parseFloat(resDist.data); 

        // PIR Alert
        if (pirValue == 1 || pirValue == "1") {
            db.query(
                "INSERT INTO iot_alerts (sensor_type, alert_message, status) VALUES (?, ?, ?)",
                ["PIR Sensor", "Movement detected in secure zone.", "New"]
            );
        }

        // ULTRASONIC Alert
        if (distValue > 0.1 && distValue <= 10) {
            console.log("📏 Distance Triggered! Saving...");
            db.query(
                "INSERT INTO iot_alerts (sensor_type, alert_message, status) VALUES (?, ?, ?)",
                ["Ultrasonic Sensor", `Object detected at close range: ${distValue.toFixed(1)}cm`, "New"],
                (err) => { if (err) console.error("DB Error:", err); }
            );
        }

    } catch (err) {
        // Handle Error quietly
    }
};

// Check sensors every 3 seconds (ONLY IF NOT TESTING)
if (process.env.NODE_ENV !== "test") {
    setInterval(monitorHardware, 3000);
}

// --- Standard API Routes ---
router.get('/status', async (req, res) => {
    try {
        const response = await axios.get(`${BLYNK_API_URL}/isHardwareConnected?token=${BLYNK_AUTH_TOKEN}`);
        res.json({ online: response.data });
    } catch (err) {
        res.status(500).json({ online: false });
    }
});

router.get('/alerts', (req, res) => {
    db.query("SELECT * FROM iot_alerts ORDER BY triggered_at DESC LIMIT 30", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

router.put('/alerts/:id', (req, res) => {
    const { status } = req.body;
    db.query("UPDATE iot_alerts SET status = ? WHERE id = ?", [status, req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

module.exports = router;
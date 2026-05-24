const express = require("express");

const router = express.Router();

const multer = require("multer");

/* ================= STORAGE ================= */

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() +
      "-" +
      file.originalname;

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
});

/* ================= UPLOAD ROUTE ================= */

router.post(
  "/course-image",

  upload.single("image"),

  (req, res) => {

    if (!req.file) {

      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    res.json({

      imageUrl:
        `/uploads/${req.file.filename}`,
    });
  }
);

module.exports = router;
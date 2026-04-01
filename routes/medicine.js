// const router = require("express").Router();
// const Medicine = require("../models/Medicine");
// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + file.originalname);
//   }
// });

// const upload = multer({ storage });

// // ADD MEDICINE
// router.post("/add", upload.single("image"), async (req, res) => {
//   const { name, description } = req.body;

//   const medicine = new Medicine({
//     name,
//     description,
//     image: req.file.filename
//   });

//   await medicine.save();
//   res.json("Medicine Added");
// });

// // GET ALL
// router.get("/", async (req, res) => {
//   const data = await Medicine.find();
//   res.json(data);
// });

// module.exports = router;

const router = require("express").Router();
const Medicine = require("../models/Medicine");
const multer = require("multer");

// STORAGE CONFIG
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ADD MEDICINE
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    console.log("✅ API HIT");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json("Missing fields");
    }

    const medicine = new Medicine({
      name,
      description,
      image: req.file ? req.file.filename : ""
    });

    await medicine.save();

    console.log("✅ SAVED TO DB");

    res.json("Medicine Added Successfully");
  } catch (err) {
    console.log("❌ ERROR:", err);
    res.status(500).json("Server Error");
  }
});

// GET ALL MEDICINES
router.get("/", async (req, res) => {
  try {
    const data = await Medicine.find();
    res.json(data);
  } catch (err) {
    console.log("❌ FETCH ERROR:", err);
    res.status(500).json("Error fetching data");
  }
});


// DELETE MEDICINE
router.delete("/:id", async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    console.log("🗑 Deleted:", req.params.id);
    res.json("Deleted Successfully");
  } catch (err) {
    console.log("❌ DELETE ERROR:", err);
    res.status(500).json("Delete Failed");
  }
});


// UPDATE MEDICINE (WITH IMAGE)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body;

    const updateData = {
      name,
      description
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    await Medicine.findByIdAndUpdate(req.params.id, updateData);

    console.log("✏️ Updated:", req.params.id);

    res.json("Updated Successfully");
  } catch (err) {
    console.log("❌ UPDATE ERROR:", err);
    res.status(500).json("Update Failed");
  }
});


module.exports = router;
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// ✅ MongoDB connection (REPLACE URI)
mongoose.connect("mongodb+srv://admin:Jo16sh11ika%40@cluster0.53brhfa.mongodb.net/notesDB?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log("DB connected"))
.catch(err => console.log("Mongo error:", err));

// Models
const File = require("./models/File");
const Feedback = require("./models/Feedback");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


// ✅ LOGIN ROUTE
app.post("/login", (req, res) => {
  const { username, email } = req.body;

  console.log("User logged in:", username, email);

  res.redirect("/upload.html");
});


// ✅ UPLOAD PDF
app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.send("No file uploaded");
    }

    const file = new File({
      filename: req.file.filename,
      path: req.file.path
    });

    await file.save();
    res.redirect("/upload.html");

  } catch (err) {
    console.log(err);
    res.send("Upload error");
  }
});


// ✅ GET FILES
app.get("/files", async (req, res) => {
  try {
    const files = await File.find();
    res.json(files);
  } catch (err) {
    res.status(500).send("Error fetching files");
  }
});


// ✅ FEEDBACK
app.post("/feedback", async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.send("Feedback saved");
  } catch (err) {
    console.log(err);
    res.send("Feedback error");
  }
});


// ✅ ROOT ROUTE (optional)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


// ✅ START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
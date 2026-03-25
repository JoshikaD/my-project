const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require("path");

const app = express();

// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static('uploads'));

// ✅ MongoDB (Render env variable)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

// ✅ Schemas
const userSchema = new mongoose.Schema({
  username: String,
  email: String
});

const noteSchema = new mongoose.Schema({
  filename: String
});

const feedbackSchema = new mongoose.Schema({
  message: String
});

// ✅ Models
const User = mongoose.model('User', userSchema);
const Note = mongoose.model('Note', noteSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);

// ✅ File upload
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

// ✅ Routes

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ LOGIN CLICK → redirect to upload page
app.get("/login", (req, res) => {
  res.redirect("/upload.html");
});

// Upload notes
app.post('/upload', upload.single('file'), async (req, res) => {
  const newNote = new Note({
    filename: req.file.filename
  });

  await newNote.save();

  res.send(`
    <h2>Uploaded Successfully ✅</h2>
    <p>${req.file.filename}</p>
    <a href="/upload.html">Upload Another</a>
  `);
});

// View notes
app.get('/notes', async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

// Feedback
app.post('/feedback', async (req, res) => {
  const newFeedback = new Feedback({
    message: req.body.message
  });

  await newFeedback.save();

  res.send("Feedback saved");
});

// ✅ IMPORTANT for Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
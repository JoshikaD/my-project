const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ✅ VERY IMPORTANT (serve PDFs)
app.use('/uploads', express.static('uploads'));

// ✅ MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/notesDB')
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

// ✅ ROUTES

// Home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Login (save user + go next page)
app.post('/login', async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;

  // Save user
  await User.create({ username, email });

  // Go to upload page
  res.sendFile(__dirname + '/public/upload.html');
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
  console.log("Feedback received:", req.body); // 👈 check this

  const newFeedback = new Feedback({
    message: req.body.message
  });

  await newFeedback.save();

  console.log("Saved in DB ✅");

  res.send("Feedback saved");
});
//server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");    
    });

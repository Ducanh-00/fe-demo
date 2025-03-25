const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:4200', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

mongoose
  .connect("mongodb+srv://anhtdhe141741:123@cluster0.x7dfp.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

const caseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const Case = mongoose.model("cases", caseSchema);

app.get("/api/cases", async (req, res) => {
  try {
    const cases = await Case.find();
    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/cases/:id", async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);
    if (!caseItem) {
      return res.status(404).json({ message: "Case not found" });
    }
    res.json(caseItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/cases", async (req, res) => {
  const { title, description } = req.body;

  const newCase = new Case({
    title,
    description,
  });

  try {
    const savedCase = await newCase.save();
    res.status(201).json(savedCase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

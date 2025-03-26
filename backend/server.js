const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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
  name: { type: String },
  code: { type: String },
  departmentName: { type: String },
  actualTime: { type: String },
  statusName: { type: String },
  updateAt: { type: String },
});

const Case = mongoose.model("cases", caseSchema);

app.get("/api/cases", async (req, res) => {
  try {
    const { name, code, departmentName, actualTime, statusName, updateAt } =
      req.query;

    let filterConditions = {};

    if (name) filterConditions.name = { $regex: name, $options: "i" };
    if (code) filterConditions.code = { $regex: code, $options: "i" };
    if (departmentName)
      filterConditions.departmentName = {
        $regex: departmentName,
        $options: "i",
      };
    if (statusName)
      filterConditions.statusName = { $regex: statusName, $options: "i" };
    if (actualTime) filterConditions.actualTime = actualTime;
    if (updateAt) filterConditions.updateAt = updateAt;

    const cases = await Case.find(filterConditions);

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
  const name = req.body.data.name;
  const code = req.body.data.code;
  const departmentName = req.body.data.departmentName;
  const actualTime = req.body.data.actualTime;
  const statusName = req.body.data.statusName;
  const updateAt = req.body.data.updateAt;

  try {
    const newCase = await Case.create({
      name,
      code,
      departmentName,
      actualTime,
      statusName,
      updateAt,
    });

    console.log("newCase:", newCase);
    const savedCase = await newCase.save();
    res.status(201).json(savedCase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put("/api/cases/:id", async (req, res) => {
  const id = req.params.id;
  const name = req.body.data.name;
  const code = req.body.data.code;
  const departmentName = req.body.data.departmentName;
  const actualTime = req.body.data.actualTime;
  const statusName = req.body.data.statusName;
  const updateAt = req.body.data.updateAt;

  try {
    const updatedCase = await Case.findByIdAndUpdate(
      id,
      {
        name,
        code,
        departmentName,
        actualTime,
        statusName,
        updateAt,
      },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.json(updatedCase);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/api/cases/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const deletedCase = await Case.findByIdAndDelete(req.params.id);
    if (!deletedCase) {
      return res.status(404).json({ message: "Case not found" });
    }
    res.json({ message: "Case deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

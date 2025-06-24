const express = require("express");
const cors = require("cors");
require("./config");
const {
  ComplaintModel,
  UserModel,
  AssignedComplaint,
  MessageModel,
} = require("./Schema");

const app = express();
const PORT = 8000;

// Middleware
app.use(express.json());
app.use(cors());

// 🌐 Welcome message
console.log(`🚀 Server running at http://localhost:${PORT}`);
console.log("MongoDB connected");

/* ======================== SIGNUP ======================== */
app.post("/SignUp", async (req, res) => {
  console.log("📦 Received data:", req.body);

  try {
    const user = new UserModel(req.body);
    const resultUser = await user.save();
    res.status(200).json({ message: "Registered Successfully", user: resultUser });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(400).json({ message: "Registration failed", error: error.message });
  }
});

/* ======================== LOGIN ======================== */
app.post("/Login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "User doesn't exist" });
  }
  if (user.password === password) {
    return res.status(200).json(user);
  } else {
    return res.status(401).json({ message: "Invalid Credentials" });
  }
});

/* ==================== MESSAGE ===================== */
app.post("/messages", async (req, res) => {
  try {
    const { name, message, complaintId } = req.body;
    const messageData = new MessageModel({ name, message, complaintId });
    const messageSaved = await messageData.save();
    res.status(200).json(messageSaved);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

app.get("/messages/:complaintId", async (req, res) => {
  try {
    const { complaintId } = req.params;
    const messages = await MessageModel.find({ complaintId }).sort("-createdAt");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
});

/* =================== COMPLAINTS =================== */
app.post("/Complaint/:id", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const complaint = new ComplaintModel(req.body);
    const resultComplaint = await complaint.save();
    res.status(200).json(resultComplaint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to register complaint" });
  }
});

app.get("/status/:id", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const comment = await ComplaintModel.find({ userId: req.params.id });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve complaints" });
  }
});

app.get("/status", async (req, res) => {
  try {
    const complaints = await ComplaintModel.find();
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve all complaints" });
  }
});

/* ================= ASSIGN COMPLAINT ================= */
app.post("/assignedComplaints", async (req, res) => {
  try {
    const assignedComplaint = req.body;
    await AssignedComplaint.create(assignedComplaint);
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ error: "Failed to add assigned complaint" });
  }
});

/* ================== USER TYPES ==================== */
app.get("/AgentUsers", async (req, res) => {
  try {
    const users = await UserModel.find({ userType: "Agent" });
    res.status(users.length ? 200 : 404).json(users.length ? users : { error: "No agents found" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/OrdinaryUsers", async (req, res) => {
  try {
    const users = await UserModel.find({ userType: "Ordinary" });
    res.status(users.length ? 200 : 404).json(users.length ? users : { error: "No users found" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ================== DELETE USER ==================== */
app.delete("/OrdinaryUsers/:id", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await UserModel.deleteOne({ _id: req.params.id });
    await ComplaintModel.deleteMany({ userId: req.params.id });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
});

/* ================== SERVER LISTEN ==================== */
app.listen(PORT, () => console.log(`✅ Backend running at http://localhost:${PORT}`));

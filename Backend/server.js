const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Adjust frontend origin
app.use(cookieParser());

mongoose.connect("mongodb://localhost:27017/todoapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
const Task = mongoose.model("Task", taskSchema);

// Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "Lax" });
    res.json({ username: user.username });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Logout Route
app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

// Middleware to Verify Token from Cookies
const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};

// Fetch Tasks
app.get("/tasks", authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Create Task
app.post("/tasks", authenticate, async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const newTask = new Task({ title, description, status, userId: req.user.userId });
    await newTask.save();
    res.status(201).json({ message: "Task added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save task" });
  }
});

app.put("/tasks/:id", authenticate, async (req, res) => {
  await Task.findOneAndUpdate({ _id: req.params.id, userId: req.user.userId }, req.body);
  res.json({ message: "Task updated" });
});

app.delete("/tasks/:id", authenticate, async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
  res.json({ message: "Task deleted" });
});

app.listen(5000, () => console.log("Server running on port 5000"));

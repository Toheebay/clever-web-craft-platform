import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

// Create Task
router.post("/", async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.json(task);
});

// Get All Tasks
router.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

export default router;
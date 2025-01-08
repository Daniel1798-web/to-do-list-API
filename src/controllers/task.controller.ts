import { Request, Response } from "express";
import Task from "../models/task.model";

export const createTask = async (req: Request, res: Response) => {
  const { title, description } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      completed: false, 
      user: req.user.id, 
    });

    await newTask.save();
    res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Error getting tasks", error });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const task = await Task.findOne({ _id: id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ message: "Error getting task", error });
  }
};

export const updateTaskById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  try {
    const task = await Task.findOne({ _id: id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.completed = completed !== undefined ? completed : task.completed;

    await task.save();
    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
};

export const deleteTaskById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};

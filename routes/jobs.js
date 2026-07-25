const express = require("express");
const Job = require("../models/jobs");
const jobRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { log, error } = require("node:console");

// API route to post a new job

jobRouter.post("/jobs", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const { company, role, location, jobLink, salary, jobType, platform } =
      req.body;

    const job = new Job({
      user: loggedInUser._id,
      company,
      role,
      jobType,
      platform,
      location,
      jobLink,
      salary,
    });
    const savedJob = await job.save();
    if (savedJob) {
      return res
        .status(201)
        .json({ message: "Job added successfully", job: savedJob });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to post new job", error: err.message });
  }
});

// API route to get all jobs

jobRouter.get("/jobs", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const jobs = await Job.find({ user: loggedInUser });

    if (jobs.length !== 0) {
      res.status(200).json({ message: "Jobs fetched successfully!", jobs });
    } else {
      res.status(200).json({ message: "No Job(s) found!" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch all jobs", error: err.message });
  }
});

// API route to get a job by ID

jobRouter.get("/jobs/:id", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const jobId = req.params.id;
    const job = await Job.findById({ _id: jobId });
    if (!job) {
      return res.status(404).json({ message: "No Job found!" });
    }
    res.status(200).json(job);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch all jobs", error: err.message });
  }
});

// API route to update job details

jobRouter.put("/jobs/:id", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const jobId = req.params.id;

    // Find the job that belongs to loggedin-user
    const job = await Job.findOne({ _id: jobId, user: loggedInUser });
    if (!job) {
      return res.status(404).json({ message: "Job not found!" });
    }
    // Updating only the fields that were sent in a request
    Object.assign(job, req.body);
    await job.save();
    res.status(200).json({
      message: "Job updated successfully",
      job,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch all jobs", error: err.message });
  }
});

// API route to delete a job

jobRouter.delete("/jobs/:id", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const jobId = req.params.id;

    const deletedJob = await Job.findOneAndDelete({
      _id: jobId,
      user: loggedInUser,
    });

    if (!deletedJob) {
      return res.status(404).json({ message: "No job found" });
    }

    res.status(200).json({ message: "Job deleted successfully!", deletedJob });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to delele job", error: err.message });
  }
});

module.exports = jobRouter;

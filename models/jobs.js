const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Applied", "Rejected", "Accepted", "Interview"],
      default: "Applied",
    },
    salary: {
      type: String,
      required: true,
    },
    jobLink: {
      type: String,
      required: true,
    },
    appliedDate: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  },
  { timestamps: true },
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;

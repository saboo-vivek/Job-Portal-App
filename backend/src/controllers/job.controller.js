const Job = require("../models/job.model");
const Application = require("../models/application.model");
const User = require("../models/user.model");

// Helper to escape regex special characters
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// 🟢 Create a new job (Employer only)
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      experienceLevel,
      salaryMin,
      salaryMax,
      jobType,
      locationType,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ msg: "Title and description are required" });
    }

    const job = await Job.create({
      title: title.trim(),
      description: description.trim(),
      location: (location || "Remote").trim(),
      experienceLevel: experienceLevel || "Entry",
      salaryMin: Number(salaryMin) || 0,
      salaryMax: Number(salaryMax) || 0,
      jobType: jobType || "Full-Time",
      locationType: locationType || "On-site",
      employerId: req.user.id,
    });

    res.status(201).json(job);
  } catch (err) {
    console.error("❌ Job creation error:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Get all jobs (Public)
exports.getJobs = async (req, res) => {
  try {
    const { q, location, jobType, locationType, experienceLevel, minSalary, maxSalary } = req.query;

    const filter = {};

    if (q && typeof q === "string" && q.trim()) {
      filter.title = { $regex: escapeRegex(q.trim()), $options: "i" };
    }
    if (location && typeof location === "string" && location.trim()) {
      filter.location = { $regex: escapeRegex(location.trim()), $options: "i" };
    }
    if (jobType) filter.jobType = jobType;
    if (locationType) filter.locationType = locationType;
    if (experienceLevel) filter.experienceLevel = experienceLevel;

    // Overlapping salary range filter
    if (minSalary && !isNaN(Number(minSalary))) {
      filter.salaryMax = { $gte: Number(minSalary) };
    }
    if (maxSalary && !isNaN(Number(maxSalary))) {
      filter.salaryMin = { $lte: Number(maxSalary) };
    }

    const jobs = await Job.find(filter)
      .populate("employerId", "name logo description website contactInfo officeAddress email")
      .sort({ createdAt: -1 })
      .lean();

    res.json(jobs);
  } catch (err) {
    console.error("❌ Error fetching jobs:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Get a single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("employerId", "name logo description website contactInfo officeAddress email")
      .lean();
    if (!job) return res.status(404).json({ msg: "Job not found" });

    res.json(job);
  } catch (err) {
    console.error("❌ Error fetching job by ID:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Get jobs posted by the logged-in employer
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employerId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    res.json(jobs);
  } catch (err) {
    console.error("❌ Error fetching employer jobs:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Update a job (Employer only)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      employerId: req.user.id,
    });

    if (!job) return res.status(404).json({ msg: "Job not found or not authorized" });

    const allowedFields = [
      "title",
      "description",
      "location",
      "experienceLevel",
      "salaryMin",
      "salaryMax",
      "jobType",
      "locationType",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    await job.save();
    res.json(job);
  } catch (err) {
    console.error("❌ Error updating job:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Delete a job (Employer only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      employerId: req.user.id,
    });

    if (!job) return res.status(404).json({ msg: "Job not found or not authorized" });

    // Cleanup associated applications & seeker appliedJobs references
    await Application.deleteMany({ jobId: req.params.id });
    await User.updateMany(
      { appliedJobs: req.params.id },
      { $pull: { appliedJobs: req.params.id } }
    );

    res.json({ msg: "Job deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting job:", err);
    res.status(500).json({ error: err.message });
  }
};

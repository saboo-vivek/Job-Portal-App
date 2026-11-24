const User = require("../models/user.model");
const Job = require("../models/job.model");
const Application = require("../models/application.model");

const PRIMARY_DEMO_EMAILS = [
  "demo.seeker@jobexecutive.com",
  "demo.employer@jobexecutive.com",
  "demo.admin@jobexecutive.com",
];

/* =========================
    🧑‍💼 USER MANAGEMENT
========================= */

// 📋 Get all users (seekers + employers + admins)
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 }).lean();
    res.json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ msg: "Failed to fetch users" });
  }
};

// 🧑‍💻 Get all job seekers only
exports.listSeekers = async (req, res) => {
  try {
    const seekers = await User.find({ role: "SEEKER" }, "-password").sort({ createdAt: -1 }).lean();
    res.json(seekers);
  } catch (err) {
    console.error("❌ Error fetching seekers:", err);
    res.status(500).json({ msg: "Failed to fetch seekers" });
  }
};

// 🏢 Get all employers only
exports.listEmployers = async (req, res) => {
  try {
    const employers = await User.find({ role: "EMPLOYER" }, "-password").sort({ createdAt: -1 }).lean();
    res.json(employers);
  } catch (err) {
    console.error("❌ Error fetching employers:", err);
    res.status(500).json({ msg: "Failed to fetch employers" });
  }
};

// 🗑️ Delete a user (and cleanup orphaned records)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Safeguard: Protect primary demonstration accounts
    if (PRIMARY_DEMO_EMAILS.includes(user.email.toLowerCase())) {
      return res.status(403).json({ msg: "Core demonstration accounts cannot be deleted" });
    }

    // Safeguard: Demo admin cannot delete real users
    if (req.userDoc?.isDemo && !user.isDemo) {
      return res.status(403).json({ msg: "Demo administrator cannot delete real production users" });
    }

    if (user.role === "EMPLOYER") {
      const employerJobs = await Job.find({ employerId: id }).select("_id").lean();
      const jobIds = employerJobs.map(j => j._id);
      await Application.deleteMany({ jobId: { $in: jobIds } });
      await Job.deleteMany({ employerId: id });
    } else if (user.role === "SEEKER") {
      await Application.deleteMany({ seekerId: id });
      await Job.updateMany(
        {},
        {
          $pull: {
            applicants: id,
            shortlisted: id,
            rejected: id,
          },
        }
      );
    }

    await User.findByIdAndDelete(id);
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).json({ msg: "Failed to delete user" });
  }
};

// ⚙️ Change a user's role
exports.changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const validRoles = ["SEEKER", "EMPLOYER", "ADMIN"];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ msg: "Invalid role" });
    }

    // Safeguard: Demo admin cannot modify user roles
    if (req.userDoc?.isDemo) {
      return res.status(403).json({ msg: "Demo administrator cannot change user roles" });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) return res.status(404).json({ msg: "User not found" });

    // Safeguard: Protect primary demo accounts from role changes
    if (PRIMARY_DEMO_EMAILS.includes(targetUser.email.toLowerCase())) {
      return res.status(403).json({ msg: "Core demonstration account roles cannot be changed" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password").lean();

    res.json(user);
  } catch (err) {
    console.error("❌ Error updating user role:", err);
    res.status(500).json({ msg: "Failed to update role" });
  }
};

/* =========================
    💼 JOB MANAGEMENT
========================= */

// 📋 Get all jobs with employer details
exports.listJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("employerId", "name email logo website officeAddress")
      .sort({ createdAt: -1 })
      .lean();
    res.json(jobs);
  } catch (err) {
    console.error("❌ Error fetching jobs:", err);
    res.status(500).json({ msg: "Failed to fetch jobs" });
  }
};

// 🗑️ Delete a job and cleanup associated applications
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const targetJob = await Job.findById(id);
    if (!targetJob) return res.status(404).json({ msg: "Job not found" });

    // Safeguard: Demo admin cannot delete real production jobs
    if (req.userDoc?.isDemo && !targetJob.isDemo) {
      return res.status(403).json({ msg: "Demo administrator cannot delete real production jobs" });
    }

    await Job.findByIdAndDelete(id);

    // Cleanup associated applications & seeker appliedJobs references
    await Application.deleteMany({ jobId: id });
    await User.updateMany(
      { appliedJobs: id },
      { $pull: { appliedJobs: id } }
    );

    res.json({ msg: "Job deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting job:", err);
    res.status(500).json({ msg: "Failed to delete job" });
  }
};

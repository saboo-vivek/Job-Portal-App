const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    experienceLevel: { type: String, default: "Entry" },
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    jobType: { type: String, enum: ["Full-Time", "Part-Time", "Contract", "Internship"], default: "Full-Time" },
    locationType: { type: String, enum: ["On-site", "Remote", "Hybrid"], default: "On-site" },

    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    shortlisted: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    rejected: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Internal demonstration job flag
    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true }
);


/* -------------------- INDEXES -------------------- */
jobSchema.index({ employerId: 1, createdAt: -1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ jobType: 1, locationType: 1, experienceLevel: 1 });
jobSchema.index({ salaryMin: 1, salaryMax: 1 });
jobSchema.index({ isDemo: 1 });

module.exports = mongoose.models.Job || mongoose.model("Job", jobSchema);


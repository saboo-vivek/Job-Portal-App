const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    seekerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["APPLIED", "SHORTLISTED", "HIRED", "REJECTED"],
      default: "APPLIED",
    },
  },
  { timestamps: true }
);

/* -------------------- INDEXES -------------------- */
applicationSchema.index({ jobId: 1, seekerId: 1 }, { unique: true });
applicationSchema.index({ seekerId: 1, createdAt: -1 });
applicationSchema.index({ jobId: 1, status: 1 });

module.exports = mongoose.models.Application || mongoose.model("Application", applicationSchema);

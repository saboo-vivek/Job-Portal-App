require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./config/db");
const setupSwagger = require("./swagger");
const seedDefaultUsers = require("./utils/seedUsers");

// Routes
const authRoutes = require("./routes/auth.routes");
const jobRoutes = require("./routes/job.routes");
const applicationRoutes = require("./routes/application.routes");
const adminRoutes = require("./routes/admin.routes");
const blogRoutes = require("./routes/blog.routes");
const aiRoutes = require("./routes/ai.routes");

const app = express();

/* -------------------- DATABASE -------------------- */
connectDB()
  .then(async () => {
    console.log("✅ MongoDB Connected");
    if (process.env.ENABLE_DEMO_DATA === "true") {
      try {
        const seedDemoData = require("./utils/seedDemoData");
        await seedDemoData();
      } catch (seedErr) {
        console.error("⚠️ Demo data seeding error:", seedErr.message);
      }
    }
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });

/* -------------------- MIDDLEWARE -------------------- */
app.use(helmet());
app.use(cors({ origin: "*" }));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));

/* -------------------- SWAGGER -------------------- */
setupSwagger(app);

/* -------------------- ROUTES -------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/ai", aiRoutes);

/* -------------------- HEALTH & ROOT -------------------- */
app.get("/api", (req, res) => {
  res.send("Job Executive API running ✅");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

/* -------------------- LOCAL SERVER (COMMENTED) -------------------- */
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

/* -------------------- 404 & ERROR HANDLING -------------------- */
app.use((req, res, next) => {
  res.status(404).json({ msg: `Endpoint ${req.method} ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error("❌ Unhandled server error:", err);
  const status = err.status || err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";
  res.status(status).json({
    error: isProduction ? "Internal server error" : (err.message || "An unexpected error occurred"),
    ...(isProduction ? {} : { stack: err.stack }),
  });
});

module.exports = app;

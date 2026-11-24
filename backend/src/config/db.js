

const mongoose = require("mongoose");

const getMongoUri = () => {
  if (process.env.NODE_ENV === "production") {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI must be configured in production");
    }
    return process.env.MONGO_URI;
  }

  return "mongodb://127.0.0.1:27017/jobexecutive";
};

const connectDB = async () => {
  try {
    await mongoose.connect(getMongoUri());
    console.log(
      process.env.NODE_ENV === "production"
        ? "✅ Production MongoDB connected"
        : "✅ Local MongoDB connected"
    );
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

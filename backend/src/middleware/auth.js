const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const rateLimit = require("express-rate-limit");

exports.authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) return res.status(401).json({ msg: "No authorization header" });

  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer")
    return res.status(401).json({ msg: "Invalid auth format" });

  const token = parts[1];
  try {
    const secret = process.env.JWT_SECRET || "supersecret123";
    const payload = jwt.verify(token, secret);

    // attach user doc
    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ msg: "User no longer exists" });

    req.user = { id: payload.id, role: payload.role, email: payload.email };
    req.userDoc = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

// helper to require role(s) e.g., requireRole("EMPLOYER")
exports.requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ msg: "Unauthorized" });
  if (!roles.includes(req.user.role))
    return res.status(403).json({ msg: "Forbidden: insufficient role" });
  next();
};

// Auth rate limiter to prevent brute-force attacks on login/register
exports.authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes per IP
  message: {
    msg: "Too many authentication requests from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// AI rate limiter
exports.aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per user/IP
  message: {
    msg: "Too many AI requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Safeguard against modifying shared public demo account credentials
exports.protectDemoAccount = (req, res, next) => {
  if (req.userDoc && req.userDoc.isDemo) {
    if (req.body.password || (req.body.email && req.body.email.toLowerCase() !== req.userDoc.email.toLowerCase())) {
      return res.status(403).json({
        msg: "Demo accounts are public and shared. Email and password changes are disabled.",
      });
    }
  }
  next();
};

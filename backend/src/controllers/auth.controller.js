const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { isValidGoogleDriveUrl } = require("../utils/validators");

const getJwtSecret = () => process.env.JWT_SECRET || "supersecret123";

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters long" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const requestedRole = (role || "SEEKER").toUpperCase();

    if (!["SEEKER", "EMPLOYER"].includes(requestedRole)) {
      return res.status(403).json({ msg: "Invalid registration role" });
    }

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashed,
      role: requestedRole,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      getJwtSecret(),
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (role && role.toUpperCase() !== user.role) {
      return res.status(403).json({ msg: "Selected role does not match this account" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      getJwtSecret(),
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET PROFILE
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").lean();
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      logo,
      description,
      website,
      email,
      contactInfo,
      officeAddress,
      bio,
      phone,
      photoUrl,
      skills,
      resumeUrl,
      expectedSalary,
      jobAlertsEnabled,
      jobAlertsPreferences,
    } = req.body;

    // Validate resume URL if provided
    if (resumeUrl && !isValidGoogleDriveUrl(resumeUrl)) {
      return res.status(400).json({
        msg: "Invalid resume link. Please provide a valid URL.",
      });
    }

    // Protect demo account from changing email
    const isDemo = req.userDoc?.isDemo;
    const canChangeEmail = !isDemo && email;

    const updates = {
      ...(name && { name: name.trim() }),
      ...(logo && { logo: logo.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(website !== undefined && { website: website.trim() }),
      ...(canChangeEmail && { email: email.toLowerCase().trim() }),
      ...(contactInfo !== undefined && { contactInfo: contactInfo.trim() }),
      ...(officeAddress !== undefined && { officeAddress: officeAddress.trim() }),
      ...(bio !== undefined && { description: bio.trim() }),

      // Seeker fields
      ...(phone !== undefined && { phone: phone.trim() }),
      ...(photoUrl && { photoUrl: photoUrl.trim() }),
      ...(skills && Array.isArray(skills) && { skills }),
      ...(resumeUrl !== undefined && { resumeUrl: resumeUrl.trim() }),
      ...(expectedSalary !== undefined && { expectedSalary: Number(expectedSalary) || 0 }),
      ...(jobAlertsEnabled !== undefined && { jobAlertsEnabled: Boolean(jobAlertsEnabled) }),
      ...(jobAlertsPreferences && { jobAlertsPreferences }),
    };

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true })
      .select("-password")
      .lean();

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      msg: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET ALL COMPANIES
exports.getAllCompanies = async (req, res) => {
  try {
    const employers = await User.find({ role: "EMPLOYER" })
      .select("name logo description website contactInfo officeAddress email reviews jobs")
      .lean();

    res.json(employers);
  } catch (err) {
    console.error("Error fetching companies:", err);
    res.status(500).json({ error: err.message });
  }
};

// ADD COMPANY REVIEW
exports.addCompanyReview = async (req, res) => {
  try {
    const { rating, comment, reviewerName } = req.body;
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ msg: "Rating must be an integer between 1 and 5" });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({ msg: "Review comment cannot be empty" });
    }

    const employer = await User.findOne({ _id: req.params.id, role: "EMPLOYER" });
    if (!employer) return res.status(404).json({ msg: "Company not found" });

    employer.reviews.push({
      authorId: req.user.id,
      reviewerName: (reviewerName || req.userDoc.name || "Anonymous").trim(),
      rating,
      comment: comment.trim(),
    });

    await employer.save();
    res.json(employer);
  } catch (err) {
    console.error("Review error:", err);
    res.status(500).json({ error: err.message });
  }
};

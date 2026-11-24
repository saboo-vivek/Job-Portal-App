const BlogPost = require("../models/blog.model");

/* -------------------- ADD / UPDATE REACTION -------------------- */
exports.reactToBlog = async (req, res) => {
  try {
    const { type } = req.body;
    if (!type || !["like", "love", "dislike"].includes(type)) {
      return res.status(400).json({ message: "Invalid reaction type. Must be 'like', 'love', or 'dislike'" });
    }

    const blog = await BlogPost.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const userIdStr = (req.user?.id || req.userDoc?._id).toString();

    const existing = blog.reactions.find(
      r => r.userId.toString() === userIdStr
    );

    if (existing) {
      existing.type = type;
    } else {
      blog.reactions.push({
        userId: userIdStr,
        type
      });
    }

    await blog.save();
    res.json(blog.reactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* -------------------- REMOVE REACTION -------------------- */
exports.removeReaction = async (req, res) => {
  try {
    const blog = await BlogPost.findById(req.params.id);
    if (!blog)
      return res.status(404).json({ success: false, message: "Blog not found" });

    const userIdStr = (req.user?.id || req.userDoc?._id).toString();

    blog.reactions = blog.reactions.filter(
      r => r.userId.toString() !== userIdStr
    );

    await blog.save();
    res.json({ success: true, reactions: blog.reactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

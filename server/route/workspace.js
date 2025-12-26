const express = require("express");
const Workspace = require("../model/Workspace");
const SenderContext = require("../model/SenderContext");
const Recipient = require("../model/Recipient");
const Email = require("../model/Email");
const userMiddleware = require("../middleware/userMiddleware");

const router = express.Router();


// CREATE WORKSPACE
router.post("/", userMiddleware, async (req, res) => {
  try {
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Workspace name is required" });
    }

    const workspace = await Workspace.create({
      userId: req.userId,
      name: name.trim(),
      color: color || "blue",
    });

    return res.status(201).json({ workspace });
  } catch (err) {
    console.error("Create Workspace Error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});


// GET ALL WORKSPACES FOR USER
router.get("/", userMiddleware, async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      userId: req.userId,
    }).sort({ updatedAt: -1 });

    return res.json(workspaces);
  } catch (err) {
    console.error("Fetch Workspaces Error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});


// GET FULL WORKSPACE DATA
router.get("/:id", userMiddleware, async (req, res) => {
  try {
    const id = req.params.id;

    const workspace = await Workspace.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const [senderContext, recipients, emails] = await Promise.all([
      SenderContext.findOne({ workspaceId: id }),
      Recipient.find({ workspaceId: id }),
      Email.find({ workspaceId: id }),
    ]);

    return res.json({
      workspace,
      senderContext,
      recipients,
      emails,
    });

  } catch (err) {
    console.error("Workspace Fetch Error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});


// UPDATE WORKSPACE
router.patch("/:id", userMiddleware, async (req, res) => {
  try {
    const { name, color } = req.body;

    const workspace = await Workspace.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (name !== undefined) workspace.name = name.trim();
    if (color !== undefined) workspace.color = color;

    await workspace.save();

    return res.json({ workspace });
  } catch (err) {
    console.error("Update Workspace Error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});


// DELETE WORKSPACE
router.delete("/:id", userMiddleware, async (req, res) => {
  try {
    const workspace = await Workspace.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    return res.json({ message: "Workspace deleted" });
  } catch (err) {
    console.error("Delete Workspace Error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

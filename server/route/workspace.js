const Workspace = require("../model/Workspace");
const userMiddleware = require("../middleware/userMiddleware");

const Router = require("express")
const workspaceRouter = Router()

// Create Workspace
workspaceRouter.post("/create", userMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Workspace name is required",
        code: 400,
      });
    }

    const workspace = await Workspace.create({
      userId: req.userId,
      name,
    });

    return res.status(201).json({
      message: "Workspace created",
      workspace,
      code: 201,
    });

  } catch (err) {
    console.error("Workspace Error:", err.message);

    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
      code: 500,
    });
  }
});

// Get all workspaces
workspaceRouter.get("/all", userMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const workspaces = await Workspace.find({ userId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Fetched workspaces",
      count: workspaces.length,
      workspaces,
      code: 200,
    });

  } catch (err) {
    console.error("Workspace Fetch Error:", err.message);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
      code: 500,
    });
  }
});


module.exports = workspaceRouter;

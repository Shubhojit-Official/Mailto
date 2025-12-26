const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const { JWT_SECRET } = require("../config");
// const userMiddleware = require("../middleware/userMiddleware");

const { Router } = require("express")
userRouter = Router()

// SIGNUP
userRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Auto login
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// LOGIN
userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

/*userRouter.get("/secure", userMiddleware, (req, res) => {
  return res.json({ message: "Protected route success", user: req.user });
});*/

module.exports = userRouter;

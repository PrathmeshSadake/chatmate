import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      username: name,
      email,
      phone: phoneNumber,
      password: hashedPassword,
    });
    res
      .status(200)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.log(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ message: "User already exists" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.username },
      "prathmeshsadake",
      {
        expiresIn: "1d",
      }
    );
    res.cookie("jwt", token, { httpOnly: true });
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

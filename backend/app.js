// server.js
const express = require("express");
const bcrypt = require("bcrypt");
const { default: sequelize } = require("./utils/database");

const app = express();
const PORT = 3001;

app.use(express.json());

app.post("/signup", async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
    });
    res
      .status(200)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ message: "User already exists" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        res.status(200).json({ message: "Login successful", user });
      } else {
        res.status(401).json({ message: "Invalid password" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

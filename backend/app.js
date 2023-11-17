// server.js
const express = require("express");
const bcrypt = require("bcrypt");
const { default: sequelize } = require("./utils/database");
const { default: Message } = require("./models/Message");
const { default: User } = require("./models/User");
const Group = require("./models/Group");
const { default: UserGroup } = require("./models/UserGroup");

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

app.post("/api/messages", async (req, res) => {
  const { userId, text } = req.body;

  try {
    const newMessage = await Message.create({ userId, text });
    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Message.findAll();
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new group
app.post("/api/groups", async (req, res) => {
  const { name } = req.body;
  try {
    const newGroup = await Group.create({ name });
    res.status(201).json(newGroup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Send a message to a group
app.post("/api/groups/:groupId/messages", async (req, res) => {
  const { userId, text } = req.body;
  const groupId = req.params.groupId;
  try {
    const group = await Group.findByPk(groupId);
    if (!group) {
      res.status(404).json({ error: "Group not found" });
      return;
    }
    await Message.create({ userId, groupId, text });
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Send a message to a group
app.post("/api/groups/:groupId/messages", async (req, res) => {
  const { userId, text } = req.body;
  const groupId = req.params.groupId;
  try {
    const group = await Group.findByPk(groupId);
    if (!group) {
      res.status(404).json({ error: "Group not found" });
      return;
    }
    await Message.create({ userId, groupId, text });
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/users/:userId/groups", async (req, res) => {
  const userId = req.params.userId;
  try {
    const userGroups = await UserGroup.findAll({
      where: { userId },
      include: [{ model: Group }],
    });
    const groups = userGroups.map((userGroup) => userGroup.Group);
    res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import sequelize from "./utils/database.js";
import Message from "./models/Message.js";
import User from "./models/User.js";
import Group from "./models/Group.js";
import UserGroup from "./models/UserGroup.js";

import authRoutes from "./routes/auth.js";

import verifyToken from "./middleware/verifytoken.js";

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

User.belongsToMany(Group, {
  through: UserGroup,
  foreignKey: "userId",
  as: "joinedGroups",
});
User.belongsToMany(Group, {
  through: UserGroup,
  foreignKey: "userId",
  as: "adminGroups",
});
Group.belongsToMany(User, { through: UserGroup, foreignKey: "groupId" });

User.hasMany(Message);
Message.belongsTo(User);

app.use("/api/auth", authRoutes);

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
app.post("/api/groups", verifyToken, async (req, res) => {
  try {
    const { name } = req.body;
    const adminId = req.user.userId;

    // Check if the admin user exists
    const adminUser = await User.findByPk(adminId);
    if (!adminUser) {
      return res.status(404).json({ error: "Admin user not found" });
    }

    // Create the group
    const newGroup = await Group.create({ name, adminId });

    // Add the admin user to the UserGroup table with isAdmin set to true
    await UserGroup.create({
      userId: adminId,
      groupId: newGroup.id,
      isAdmin: true,
    });

    res.status(201).json({
      id: newGroup.id,
      name: newGroup.name,
      adminId: newGroup.adminId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//  join a group by name
app.post("/api/groups/join-group-by-name", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { groupName } = req.body;

    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the group exists
    const group = await Group.findOne({ where: { name: groupName } });
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Check if the user is already part of the group
    const existingMembership = await UserGroup.findOne({
      where: { userId, groupId: group.id },
    });

    if (existingMembership) {
      return res
        .status(400)
        .json({ error: "User is already a member of the group" });
    }

    // Add the user to the group
    await UserGroup.create({ userId, groupId: group.id, isAdmin: false });

    res
      .status(201)
      .json({ success: true, message: "User joined the group successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all user groups
app.get("/api/users/:userId/groups", async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Group,
          as: "joinedGroups",
          attributes: ["id", "name"],
        },
        {
          model: Group,
          as: "adminGroups",
          attributes: ["id", "name"],
        },
      ],
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const processedJoinedGroups = user.joinedGroups
      .filter((joinedGroup) => {
        // Check if the group is not in adminGroups
        return !user.adminGroups.some(
          (adminGroup) => adminGroup.id === joinedGroup.id
        );
      })
      .map((group) => ({ ...group.toJSON() }));

    const allGroups = {
      groups: [
        ...processedJoinedGroups,
        ...user.adminGroups.map((group) => ({
          ...group.toJSON(),
        })),
      ],
    };

    res.json(allGroups.groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get a group by groupId
app.get("/api/groups/:groupId", async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId, {
      include: [
        {
          model: User,
          through: {
            attributes: ["isAdmin"],
          },
        },
      ],
    });

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Send a message to a group
app.post("/api/groups/:groupId/messages", verifyToken, async (req, res) => {
  const { text } = req.body;
  const groupId = req.params.groupId;
  const userId = req.user.userId;
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

// get all messages for a specific group
app.get("/api/groups/:groupId/messages", async (req, res) => {
  const groupId = req.params.groupId;

  try {
    const messages = await Message.findAll({
      where: { groupId },
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
      order: [["createdAt", "ASC"]], // Order by creation time (you can adjust this based on your needs)
    });

    res.json({ messages });
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

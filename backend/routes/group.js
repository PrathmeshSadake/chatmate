import express from "express";
import Group from "../models/Group.js";
import User from "../models/User.js";
import UserGroup from "../models/UserGroup.js";
import verifyToken from "../middleware/verifytoken.js";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    const { name } = req.body;
    const adminId = req.user.userId;

    const adminUser = await User.findByPk(adminId);
    if (!adminUser) {
      return res.status(404).json({ error: "Admin user not found" });
    }

    const newGroup = await Group.create({ name, adminId });

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

router.post("/join-group-by-name", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { groupName } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const group = await Group.findOne({ where: { name: groupName } });
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const existingMembership = await UserGroup.findOne({
      where: { userId, groupId: group.id },
    });

    if (existingMembership) {
      return res
        .status(400)
        .json({ error: "User is already a member of the group" });
    }

    await UserGroup.create({ userId, groupId: group.id, isAdmin: false });

    res
      .status(201)
      .json({ success: true, message: "User joined the group successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:userId", async (req, res) => {
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

router.get("/group/:groupId", async (req, res) => {
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

export default router;

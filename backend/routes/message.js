import express from "express";
import User from "../models/User.js";
import Group from "../models/Group.js";
import Message from "../models/Message.js";
import verifyToken from "../middleware/verifytoken.js";

const router = express.Router();

router.post("/:groupId", verifyToken, async (req, res) => {
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

router.get("/:groupId", async (req, res) => {
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
      order: [["createdAt", "ASC"]],
    });

    res.json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

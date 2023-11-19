import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import sequelize from "./utils/database.js";
import Message from "./models/Message.js";
import User from "./models/User.js";
import Group from "./models/Group.js";
import UserGroup from "./models/UserGroup.js";

import authRoutes from "./routes/auth.js";
import groupRoutes from "./routes/group.js";
import messageRoutes from "./routes/message.js";

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
app.use("/api/groups", groupRoutes);
app.use("/api/messages", messageRoutes);

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

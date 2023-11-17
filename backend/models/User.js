import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

import Group from "./Group.js";
import Message from "./Message.js";
import UserGroup from "./UserGroup.js";

const User = sequelize.define(
  "user",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true, // Add this line to enable timestamps
    createdAt: "createdAt", // Specify the createdAt field name
    updatedAt: "updatedAt", // Specify the updatedAt field name
  }
);

export default User;

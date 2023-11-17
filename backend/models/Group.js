import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";
import User from "./User.js";
import UserGroup from "./UserGroup.js";

const Group = sequelize.define(
  "group",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true, // Add this line to enable timestamps
    createdAt: "createdAt", // Specify the createdAt field name
    updatedAt: "updatedAt", // Specify the updatedAt field name
  }
);

export default Group;

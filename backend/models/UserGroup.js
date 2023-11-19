import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const UserGroup = sequelize.define(
  "usergroup",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true, // Add this line to enable timestamps
    createdAt: "createdAt", // Specify the createdAt field name
    updatedAt: "updatedAt", // Specify the updatedAt field name
  }
);

export default UserGroup;

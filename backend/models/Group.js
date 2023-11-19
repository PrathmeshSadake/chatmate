import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const Group = sequelize.define(
  "group",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

export default Group;

import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const Message = sequelize.define(
  "message",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true, // Add this line to enable timestamps
    createdAt: "createdAt", // Specify the createdAt field name
    updatedAt: "updatedAt", // Specify the updatedAt field name
  }
);

export default Message;

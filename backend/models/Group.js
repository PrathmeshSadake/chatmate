const { DataTypes } = require("sequelize");
const { default: sequelize } = require("../utils/database");

const Group = sequelize.define("group", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

Group.hasMany(Message);
Message.belongsTo(Group);

module.exports = Group;

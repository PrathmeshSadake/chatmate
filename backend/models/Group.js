const { DataTypes } = require("sequelize");
const { default: sequelize } = require("../utils/database");

const Group = sequelize.define("group", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

Group.belongsTo(User, { as: 'Admin', foreignKey: 'adminId' });
Group.hasMany(UserGroup);
UserGroup.belongsTo(User);
UserGroup.belongsTo(Group);
UserGroup.belongsTo(User, { as: 'Admin', foreignKey: 'userId' });

module.exports = Group;
